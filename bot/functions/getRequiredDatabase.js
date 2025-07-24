const {
    getConfessionData,
    getGuildData,
} = require("./guildData");

const dataLoaders = {
    confessionData: (interaction) => getConfessionData(interaction.guild.id),
    guildData: (interaction) => getGuildData(interaction.guild.id),
};

async function loadRequiredData(interaction, requiredData = []) {
    const db = {};

    await Promise.all(requiredData.map(async (dataName) => {
        const loader = dataLoaders[dataName];
        if (loader) {
            db[dataName] = await loader(interaction);
        }
    }));

    return db;
}

module.exports = { loadRequiredData };
