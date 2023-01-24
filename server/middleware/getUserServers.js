const { default: axios } = require("axios")

const getUserServers = async (req, res, next) => {
    if(!req.user) return res.sendStatus(500)

    const {data: userGuilds} = await axios.get("https://discord.com/api/users/@me/guilds",{
        headers: {
            "authorization": `Bearer ${req.user.discordTokens.access_token}`
        }
    })
    req.user.guilds = userGuilds
    next()
}

module.exports = getUserServers