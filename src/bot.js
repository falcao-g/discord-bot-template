const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config();
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');
const databaseHandler = require('./handlers/databaseHandler');

class Bot {
	config = require('./config.json');

	_messages = require(path.join(__dirname, '/utils/json/messages.json'));

	_banned = new Array();

	_disabledChannels = new Map();

	_disabledCommands = new Map();

	client = new Client({
		shards: 'auto',
		intents: [GatewayIntentBits.Guilds],
	});

	activeEvents = new Map();

	constructor() {
		this.client.on('ready', () => {
			console.log('Bot online');
			this.client.on('error', console.error);

			databaseHandler.connect();

			this.client.events = new Collection();
			this.client.commands = new Collection();

			loadEvents(this, this.client);
			loadCommands(this, this.client);
		});

		this.client.login(process.env.TOKEN);
		(async () => {
			const banned = await this.bannedSchema.find();

			for (const result of banned) {
				this._banned.push(result.id);
			}

			const guilds = await this.guildsSchema.find();

			for (const { _id, disabledChannels, disabledCommands } of guilds) {
				this._disabledChannels.set(_id, disabledChannels);
				this._disabledCommands.set(_id, disabledCommands);
			}

			this.config.testGuilds.forEach(async (guild) => {
				guild = this.client.guilds.cache.get(guild);
				for (const [key, value] of await guild.emojis.fetch()) {
					this.emojiList[value.name] = value;
				}
			});
		})();

		setInterval(
			() => {
				this.client.user.setActivity('/help | arte by: @kinsallum'), this.bankInterest(), this.lotteryDraw();
			},
			1000 * 60 * 5
		);

		setInterval(
			() => {
				this.randomEventsHandler();
			},
			1000 * 60 * 45
		);
	}

	ban(userId) {
		this._banned.push(userId);
	}

	unban(userId) {
		this._banned = this._banned.filter((id) => id != userId);
	}

	defaultFilter(interaction) {
		const disabledChannels = this._disabledChannels.get(interaction.guild.id);

		return !interaction.user.bot && !this._banned.includes(interaction.user.id) && disabledChannels != undefined
			? !disabledChannels.includes(interaction.channel.id)
			: true;
	}

	disableChannel(guild, channel) {
		const result = this._disabledChannels.get(guild.id);
		if (result) {
			result.push(channel.id);
			this._disabledChannels.set(guild.id, result);
		} else {
			this._disabledChannels.set(guild.id, [channel.id]);
		}
	}

	enableChannel(guild, channel) {
		let result = this._disabledChannels.get(guild.id);
		result = result.filter((channelId) => channelId != channel.id);
		this._disabledChannels.set(guild.id, result);
	}

	disableCommand(guild, command) {
		const result = this._disabledCommands.get(guild.id);
		if (result) {
			result.push(command);
			this._disabledChannels.set(guild.id, result);
		} else {
			this._disabledChannels.set(guild.id, [command]);
		}
	}

	enableCommand(guild, command) {
		let result = this._disabledCommands.get(guild.id);
		result = result.filter((commandName) => commandName != command);
		this._disabledCommands.set(guild.id, result);
	}

	getMessage(interaction, messageId, args = {}) {
		const message = this._messages[messageId];
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`);
			return 'Could not find the correct message to send. Please report this to the bot developer.';
		}

		const locale = interaction.locale ?? 'pt-BR';
		let result = message[locale] ?? message['en-US'];

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, 'g');
			result = result.replace(expression, args[key]);
		}

		this.userSchema.findByIdAndUpdate(interaction.user.id, { locale }).then(() => {});
		return result;
	}

	async getDmMessage(user, messageId, args = {}) {
		const message = this._messages[messageId];
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`);
			return 'Could not find the correct message to send. Please report this to the bot developer.';
		}

		const userFile = await this.userSchema.findById(user.id);
		const locale = userFile.locale ?? 'en-US';
		let result = message[locale] ?? message['en-US'];

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, 'g');
			result = result.replace(expression, args[key]);
		}

		return result;
	}

	createEmbed(color = 'Random') {
		return new EmbedBuilder().setColor(color).setFooter({ text: 'by Falcão ❤️' });
	}

	async editReply(interaction, { content, embeds, components, fetchReply = false }) {
		return await interaction
			.editReply({
				content,
				embeds,
				components,
				fetchReply,
			})
			.catch((err) => {
				console.error(err);
			});
	}
}

Bot = new Bot();
