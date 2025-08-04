const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildEmojiUpdate,
    async execute(oldEmoji, newEmoji) {
        const logs = newEmoji.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("✏️ Emoji actualizado")
            .addFields(
                { name: "Antes", value: oldEmoji.name, inline: true },
                { name: "Ahora", value: newEmoji.name, inline: true }
            )
            .setColor("Orange")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
