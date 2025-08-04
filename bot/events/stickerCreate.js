const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildStickerCreate,
    async execute(sticker) {
        const logs = sticker.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("🏷️ Sticker creado")
            .setDescription(`Se ha creado el sticker: **${sticker.name}**`)
            .setColor("Green")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
