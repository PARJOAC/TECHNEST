const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildEmojiCreate,
    async execute(emoji) {
        const logs = emoji.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("🆕 Emoji creado")
            .setDescription(`Se ha creado el emoji ${emoji}`)
            .setColor("Green")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
