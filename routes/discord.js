const Router = require("express").Router()
const { Routes } = require("discord.js")
const {client: dcClient, rest: dcRest} = require("../bot")

Router.get("/guilds", async (req, res) => {
    const botGuilds = await dcClient.guilds.fetch()

    const botAndUserGuilds = req.user.guilds.filter(guild => botGuilds.get(guild.id))

    res.send(botAndUserGuilds)
})

module.exports = Router