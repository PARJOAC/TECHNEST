// Import required modules from discord.js
const {
    Client,
    Collection,
    Partials,
    GatewayIntentBits
} = require("discord.js");

// Create a new Discord client instance with specific configurations
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
    ],
    shards: "auto",
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true,
    },
});

// Create a new Collection to store bot commands
client.commands = new Collection();

// Load environment variables from a .env file
require("dotenv").config();

// Import custom modules for error handling, MongoDB connection, event handling, and slash command handling
const Errors = require("./initMain/handlerErrors.js");
const MongoDB = require("./initMain/mongoDB.js");
const Events = require("./initMain/handlerEvents.js");
const SlashCommands = require("./initMain/handlerSlashCommands.js");
const { telegramClientInit } = require("./initMain/handlerTelegram.js");
/**
 * Main function to initialize and start the bot
 * @param {Client} client - The Discord client instance
 */
async function main(client) {
    await Errors(); // Initialize error handling
    await MongoDB(); // Connect to MongoDB
    await SlashCommands(client); // Set up slash commands
    await Events(client); // Set up event handlers
    await telegramClientInit(); // Set up Telegram integration
    await client.login(process.env.BOT_TOKEN); // Log in to Discord using the bot token
}

// Execute the main function to start the bot
main(client);
