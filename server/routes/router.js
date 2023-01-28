const Router = require("express").Router()
const getUser = require("../middleware/getUser")
const authRouter = require("./auth")
const discordRouter = require("./discord")
const {playerRouter} = require("./player")

Router.use("/auth", authRouter)
Router.use("/discord", getUser, discordRouter)
Router.use("/player", getUser, playerRouter)
module.exports = Router