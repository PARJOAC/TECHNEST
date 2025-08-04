const { Events, EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

module.exports = {
    name: Events.GuildEmojiDelete,
    async execute(emoji) {
        const logs = emoji.guild.channels.cache.get(config.logsEventosCanal);
        if (!logs) return;

        const embed = new EmbedBuilder()
            .setTitle("❌ Emoji eliminado")
            .setDescription(`Se ha eliminado el emoji: **${emoji.name}**`)
            .setColor("Red")
            .setTimestamp();

        logs.send({ embeds: [embed] });
    },
};
