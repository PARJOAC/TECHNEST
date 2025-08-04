const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildStickerUpdate,
    async execute(oldSticker, newSticker) {
        const logs = newSticker.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("✏️ Sticker actualizado")
            .addFields(
                { name: "Antes", value: oldSticker.name, inline: true },
                { name: "Ahora", value: newSticker.name, inline: true }
            )
            .setColor("Orange")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
