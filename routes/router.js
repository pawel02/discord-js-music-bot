const Router = require("express").Router()
const getUser = require("../middleware/getUser")
const getUserServers = require("../middleware/getUserServers")
const authRouter = require("./auth")
const discordRouter = require("./discord")

Router.use("/auth", authRouter)
Router.use("/discord", getUser, getUserServers, discordRouter)
module.exports = Router