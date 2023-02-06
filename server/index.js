require('dotenv').config();
const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require('cors')
const bodyParser = require('body-parser')
const {Server: SocketIOServer} = require("socket.io");
const mongoose = require("mongoose")
const router = require("./routes/router");
const { socketHandler, eventEmitter } = require('./routes/player');
const userModel = require('./models/user');
require("./bot")

const app = express()
app.use(cors())
const httpServer = require("http").createServer(app)

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.BASE_CLIENT_URL,
        allowedHeaders: ["auth"],
        credentials: true
      }})

app.use(bodyParser.json())
app.use(router)

const playerNamespace = io.of("/player")
    playerNamespace.use(async (socket, next) => {
        try {
            const {token} = socket.handshake.auth
            if(!token) return new Error("no token provided")
            const {id} = await jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(id)
            socket.user = user
            next()
        } catch (error) {
            socket.emit("error", error.message)
            socket.disconnect()
            console.log("error on socket validation:", error.message)
        }
        
    })
    playerNamespace.on("connection", socket => {
        socketHandler(socket, playerNamespace, io)
    })
    eventEmitter(playerNamespace, io)
mongoose.set('strictQuery', true);

const startServer = async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log("DB connected")
    httpServer.listen(process.env.PORT, (err) => {
        if (err) throw err;
        console.log("Server listening on Port : " + process.env.PORT)
    })
}

startServer()