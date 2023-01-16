const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Setzt die Wiedergabe fort"),
    execute: async ({ client, interaction }) => {
        // Get the queue for the server
        const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
        if (!queue) {
            await interaction.reply("Die Warteschlange ist leer");
            return;
        }

        // Pause the current song
        queue.setPaused(false);

        await interaction.reply("Der player wird fortgesetzt")
    },
}
