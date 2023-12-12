const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const { loadCommands } = require("../handlers/commandHandler")
const { loadEvents } = require("../handlers/eventHandler")

// this command is only for the developer(s) of the bot
// it allows them to reload commands and events without having to restart the bot

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("tools")
		.setDescription("Tools for Falbot developers")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) => subcommand.setName("reload_events").setDescription("reload your events"))
		.addSubcommand((subcommand) => subcommand.setName("reload_commands").setDescription("reload your commands")),
	execute: async ({ interaction, instance, client }) => {
		await interaction.deferReply({ ephemeral: true }).catch(() => {})
		try {
			subcommand = interaction.options.getSubcommand()
			if (subcommand === "reload_events") {
				for (const [key, value] of client.events) {
					client.removeListener(`${key}`, value, true)
				}
				loadEvents(instance, client)
				instance.editReply(interaction, {
					content: "Events reloaded",
				})
			} else {
				loadCommands(instance, client)
				instance.editReply(interaction, {
					content: "Commands reloaded",
				})
			}
		} catch (error) {
			console.error(`tools: ${error}`)
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, "EXCEPTION"),
			})
		}
	},
}
