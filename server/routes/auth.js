const Router = require("express").Router()
const User = require("../models/user")
const axios = require("axios")
const jwt = require("jsonwebtoken")

Router.post("/login", async (req, res) => {
    try {
        console.log(req.body)
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

        const existingUser = await User.findOne({discordId: discordUser.id})
        var token
        var user
        if(existingUser){
            existingUser.username= discordUser.username
            existingUser.email= discordUser.email
            existingUser.discordId= discordUser.id
            existingUser.discriminator= discordUser.discriminator
            existingUser.bannerColor= discordUser.banner_color
            existingUser.avatar= discordUser.avatar
            existingUser.discordTokens = authData
        
            await existingUser.save()
            user = existingUser
        } else {
            const newUser = new User({
                username: discordUser.username,
                email: discordUser.email,
                discordId: discordUser.id,
                discriminator: discordUser.discriminator,
                bannerColor: discordUser.banner_color,
                avatar: discordUser.avatar,
                guilds: [],
                discordTokens: authData
            })
            
            await newUser.save()
            user = newUser
        }
        
        token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );
        res.send({
            user,
            token
        })

    } catch (error) {
        console.log(error.response.data || error.message)
        res.sendStatus(500)
    }
})

module.exports = Router