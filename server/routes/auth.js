const Router = require("express").Router()
const User = require("../models/user")
const axios = require("axios")
const jwt = require("jsonwebtoken")

Router.post("/login", async (req, res) => {
    try {
        const { code } = req.body
        const params = new URLSearchParams();
        params.append('client_id', process.env.DISCORD_CLIENT_ID)
        params.append('client_secret', process.env.DISCORD_OAUTH_SECRET)
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', process.env.REDIRECT_URI)
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        const { data: authData } = await axios.post("https://discord.com/api/oauth2/token", params, headers)
        const { data: discordUser } = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${authData.access_token}`
            }
        })

        const { data: userGuilds } = await axios.get("https://discord.com/api/users/@me/guilds", {
            headers: {
                "authorization": `Bearer ${authData.access_token}`
            }
        })


        const user = await User.findOneAndUpdate({discordId: discordUser.id}, {
            username: discordUser.username,
            email: discordUser.email,
            discordId: discordUser.id,
            discriminator: discordUser.discriminator,
            bannerColor: discordUser.banner_color,
            avatar: discordUser.avatar,
            guilds: userGuilds,
            discordTokens: authData,
        }, {new: true, upsert: true, setDefaultsOnInsert: true})

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        res.send({
            user,
            token
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.name })
    }
})

module.exports = Router