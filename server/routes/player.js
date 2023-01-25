const Router = require("express").Router()
const { AudioPlayerStatus } = require("@discordjs/voice")
const { client: botClient } = require("../bot")
const { QueryType } = require("discord-player")

Router.get("/:serverId", (req, res) => {
    const { serverId } = req.params
    const guildQueue = botClient.player.getQueue(serverId)
    const timestamp = guildQueue?.getPlayerTimestamp()
    const { playing: isPlaying, repeatMode, previousTracks, current } = guildQueue || {}

    const isPaused = guildQueue?.connection?.audioPlayer?.state.status !== "playing"
    res.json({
        isPaused,
        isPlaying,
        repeatMode,
        timestamp,
        current,
    })
})

Router.get("/:serverId/queue", (req, res) => {
    const { serverId } = req.params

    const guildQueue = botClient.player.getQueue(serverId)
    const { tracks, previousTracks, current } = guildQueue || {}

    res.json({
        tracks,
        previousTracks,
        current,
    })
})

Router.post("/:serverId/setPaused", (req, res) => {
    const { serverId } = req.params
    const { state } = req.body

    const guildQueue = botClient.player.getQueue(serverId)

    if (!guildQueue) return res.sendStatus(200)
    botClient.player.emit("pausedChanged", guildQueue, state)
    guildQueue.setPaused(state)
    res.sendStatus(200)
})

Router.post("/:serverId/skip", async (req, res) => {
    const { serverId } = req.params

    const guildQueue = botClient.player.getQueue(serverId)

    if (!guildQueue) return res.sendStatus(200)
    await guildQueue.skip()
    res.sendStatus(200)
})

Router.put("/:serverId/addTrack", async (req, res) => {
    try {
        const { url } = req.body
        const result = await botClient.player.search(url, {
            requestedBy: await botClient.users.fetch(req.user.discordId),
            searchEngine: QueryType.YOUTUBE_VIDEO
        })
        const { serverId } = req.params
        const dcServer = botClient.guilds.cache.get(serverId)
        const dcMember = dcServer.members.cache.get(req.user.discordId)
        const dcVoiceChannel = dcMember.voice.channel

        if (!dcVoiceChannel) throw new Error("Member must be connected to a voice-channel")
        const guildQueue = await botClient.player.createQueue(await botClient.guilds.cache.get(serverId))
        if (!guildQueue.connection) await guildQueue.connect(dcVoiceChannel)
        // finish if no tracks were found
        if (result.tracks.length === 0)
            throw new Error("Keine Ergebnisse")

        // Add the track to the queue
        const song = result.tracks[0]
        await guildQueue.addTrack(song)
        if (!guildQueue.playing) await guildQueue.play()
        res.sendStatus(200)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

const socketHandler = (socket) => {
    socket.on("subscribe", ({ serverId }) => {
        socket.join(`subscriber-${serverId}`)
    })
}
const eventEmitter = (playerNamespace, io) => {
    botClient.player.on("trackAdd", (queue, track) => {
        const { guild, tracks } = queue
        playerNamespace.to(`subscriber-${guild.id}`).emit("trackAdd", queue, track, tracks)
    })
    botClient.player.on("trackStart", (queue, track) => {
        const { guild, repeatMode, tracks } = queue
        const timestamp = queue?.getPlayerTimestamp()
        playerNamespace.to(`subscriber-${guild.id}`).emit("trackStart", queue, track, timestamp, repeatMode, tracks)
    })
    botClient.player.on("queueEnd", (queue) => {
        const { guild } = queue
        playerNamespace.to(`subscriber-${guild.id}`).emit("queueEnd")
    })
    botClient.player.on("pausedChanged", (queue, state) => {
        const { guild } = queue
        playerNamespace.to(`subscriber-${guild.id}`).emit("pausedChanged", state)
    })
}


module.exports = {
    playerRouter: Router,
    socketHandler,
    eventEmitter
}