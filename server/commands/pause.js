const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("pausiert die Wiedergabe"),
	execute: async ({ client, interaction }) => {
		// Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

		// Check if the queue is empty
		if (!queue) {
			await interaction.reply("Die Warteschlange ist leer")
			return;
		}

		// Pause the current song
		client.player.emit("pausedChanged", queue, true)
		queue.setPaused(true);

		await interaction.reply("Der Player wurde pausiert.")
	},
}
