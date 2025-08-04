const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildStickerDelete,
    async execute(sticker) {
        const logs = sticker.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("🗑️ Sticker eliminado")
            .setDescription(`Se ha eliminado el sticker: **${sticker.name}**`)
            .setColor("Red")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
