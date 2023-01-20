require('dotenv').config();
require("./bot")
const express = require("express")
const cors = require('cors')
const router = require("./routes/router")
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(router)

const mongoose = require("mongoose")

mongoose.set('strictQuery', true);

const startServer = async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log("DB connected")
    app.listen(process.env.PORT, (err) => {
        if(err) throw err;
        console.log("Server listening on Port : " + process.env.PORT)
    })
}

startServer()