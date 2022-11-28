require('dotenv').config();

const { Client, GatewayIntentBits, Collection, Routes, REST } = require('discord.js');
const { Player } = require("discord-player")

const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.on("ready", () => {
    // Get all ids of the servers
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands })
        .then(() => console.log('Commands successfully updated!'))
        .catch(console.error);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({ client, interaction });
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: "Beim Ausführen des Befehls ist ein Fehler aufgetreten" });
    }
});

client.login(process.env.TOKEN);