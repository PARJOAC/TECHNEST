const {
    Client,
    Collection,
    Partials,
    GatewayIntentBits
} = require("discord.js");

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

client.commands = new Collection();

require("dotenv").config();

const Errors = require("./initMain/handlerErrors.js");
const MongoDB = require("./initMain/mongoDB.js");
const Events = require("./initMain/handlerEvents.js");
const SlashCommands = require("./initMain/handlerSlashCommands.js");
const { telegramClientInit } = require("./initMain/handlerTelegram.js");

async function main(client) {
    await Errors();
    await MongoDB();
    await SlashCommands(client);
    await Events(client);
    await telegramClientInit();
    await client.login(process.env.BOT_TOKEN);
}

main(client);
