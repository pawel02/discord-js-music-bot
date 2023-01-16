const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

const repeatModes = [
    { name: "off", value: "0" },
    { name: "track", value: "1" },
    { name: "queue", value: "2" },
    { name: "autoplay", value: "3" }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("steuert den Wiederholungsmodus des Bots")
        .addStringOption(option => {
            return option.setName("mode")
                .setDescription("Wiederholungsmodus")
                .addChoices(...repeatModes)
        }),

    execute: async ({ client, interaction }) => {

        // Get the queue for the server
        const queue = client.player.getQueue(interaction.guildId)

        // If there is no queue, return
        if (!queue) {
            await interaction.reply("Die Warteschlange ist leer");
            return;
        }

        // Skip the current song
        const mode = interaction.options.getString("mode")
        console.log(parseInt(mode))
        queue.setRepeatMode(parseInt(mode))

        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Der Wiederholungsmodus wurde auf **${repeatModes.find(o => o.value === mode).name}** gesetzt.`)
            ]
        })
    },
}
