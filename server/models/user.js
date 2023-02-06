const {Schema, default: mongoose} = require("mongoose")

const userSchema = new Schema({
    username: String,
    email: String,
    discordId: String,
    discriminator: String,
    bannerColor: String,
    avatar: String,
    createdAt: {
        type: String,
        default: new Date().toISOString(),
    },
    guilds: Array,
    discordTokens: {}
})

const userModel = mongoose.model("use", userSchema)

module.exports = userModel