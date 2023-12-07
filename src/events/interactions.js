module.exports = {
	name: 'interactionCreate',
	execute: async (interaction, instance, client) => {
		if (interaction.user.bot) {
			interaction.reply({
				content: instance.getMessage(interaction, 'YOU_ARE_BOT'),
				ephemeral: true,
			});
			return;
		}

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			// this handles slash commands and context menus
			const command = client.commands.get(interaction.commandName);

			if (command.cooldown) {
				// here we check if the user is on cooldown
			}

			if (command.developer && !instance.config.devs.includes(interaction.user.id)) {
				return interaction.reply({
					content: instance.getMessage(interaction, 'BOT_OWNERS_ONLY'),
					ephemeral: true,
				});
			}

			command.execute({
				interaction,
				instance,
				client,
				member: interaction.member,
				guild: interaction.guild,
				user: interaction.user,
				channel: interaction.channel,
			});
		} else if (interaction.isAutocomplete()) {
			// this handles autocompletes for slash commands
			const command = client.commands.get(interaction.commandName);
			command.autocomplete({ client, interaction, instance });
		} else if (interaction.isButton()) {
			// i recommend that you make your buttons custom id's like this: <commandName> <subcommand> <args>
			// so you can easily create a button that interacts with a specific command and subcommand with args
			const commandName = interaction.customId.split(' ')[0];
			const command = client.commands.get(commandName);

			if (command == undefined) return;

			try {
				var subcommand = interaction.options.getSubcommand();
			} catch {
				var subcommand = interaction.customId.split(' ')[1];
			}

			if (command.cooldown) {
				// here we check if the user is on cooldown
			}

			await command.execute({
				interaction,
				instance,
				client,
				member: interaction.member,
				guild: interaction.guild,
				user: interaction.user,
				channel: interaction.channel,
				subcommand,
				args: interaction.customId.split(' ').slice(2),
			});
		} else if (interaction.isStringSelectMenu()) {
			// and this is for select menus
			const command = client.commands.get(interaction.customId.split(' ')[0]);

			await command.execute({
				guild: interaction.guild,
				interaction,
				instance,
				member: interaction.member,
				client,
				user: interaction.user,
				channel: interaction.channel,
				subcommand: interaction.customId.split(' ')[1],
			});
		}
	},
};
