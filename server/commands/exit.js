const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("exit")
		.setDescription("Wirft den Bot aus dem Sprachkanal"),
	execute: async ({ client, interaction }) => {

		// Get the current queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) {
			await interaction.reply("Die Warteschlange ist leer")
			return;
		}

		// Deletes all the songs from the queue and exits the channel
		queue.destroy();

		await interaction.reply("ok.")
	},
}
