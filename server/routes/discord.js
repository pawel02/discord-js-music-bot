const Router = require("express").Router()
const enablews = require("express-ws")
const {client: dcClient} = require("../bot")
const userModel = require("../models/user")

enablews(Router)

Router.get("/guilds", async (req, res) => {
    try {
        const botGuilds = await dcClient.guilds.cache
        const botAndUserGuilds = req.user.guilds.filter(guild => botGuilds.get(guild.id))
        
        res.send(botAndUserGuilds)
        await userModel.findByIdAndUpdate(req.user._id.toString(), {
            guilds: req.user.guilds,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
    
})


module.exports = Router