const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Überspringt das aktuelle Lied"),

    execute: async ({ client, interaction }) => {

        // Get the queue for the server
        const queue = client.player.getQueue(interaction.guildId)

        // If there is no queue, return
        if (!queue) {
            await interaction.reply("Die Warteschlange ist leer");
            return;
        }

        const currentSong = queue.current

        // Skip the current song
        queue.skip()

        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${currentSong.title} wurde übersprungen!`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    },
}
