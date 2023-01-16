const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("spiele ein Lied von YouTube.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("sucht nach dem und spielt das erste Ergebniss")
                .addStringOption(option =>
                    option.setName("searchterms").setDescription("Suche").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("füge die gesammte Playlist zur Warteschlange hinzu")
                .addStringOption(option => option.setName("url").setDescription("url der Playlist").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("spielt ein einzelnes Lied von YouTube")
                .addStringOption(option => option.setName("url").setDescription("url des Songs").setRequired(true))
        ),
    execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel) return interaction.reply("Du musst mit einem Sprachkanal verbunden sein um diesen Befehl zu benutzen");

        // Create a play queue for the server
        const queue = await client.player.createQueue(interaction.guild);

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")

            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply("Keine Ergebnisse")

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** wurde zur Warteschlange hinzugefügt`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Länge: ${song.duration}` })

        }
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`keine Playlist unter ${url} gefunden`)

            // Add the tracks to the queue
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**Es wurden ${result.tracks.length} aus ${playlist.title}](${playlist.url}** zur Warteschlange hinzugefügt`)
                .setThumbnail(playlist.thumbnail.url)

        }
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("keine Ergebnisse")

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** wurde zur Warteschlange hinzugefügt`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Länge: ${song.duration}` })
        }

        // Play the song
        if (!queue.playing) await queue.play()

        // Respond with the embed containing information about the player
        await interaction.reply({
            embeds: [embed]
        })
    },
}
