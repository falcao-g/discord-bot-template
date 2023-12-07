require('dotenv').config();

// here we load all the commands
// commands marked with the developer flag will only be loaded in the test guilds
async function loadCommands(instance, client) {
	const { loadFiles } = require('../utils/fileLoader');

	await client.commands.clear();

	const commandsArray = [];
	const commandsGuild = [];

	const Files = await loadFiles('commands');

	Files.forEach((file) => {
		const command = require(file);
		client.commands.set(command.data.name, command);

		if (command.developer) {
			commandsGuild.push(command.data.toJSON());
		} else {
			commandsArray.push(command.data.toJSON());
		}

		console.log(`Command: ${command.data.name} ✅`);
	});

	client.application.commands.set(commandsArray);

	for (guild of instance.config.testGuilds) {
		client.application.commands.set(commandsGuild, guild);
	}
}

module.exports = { loadCommands };
