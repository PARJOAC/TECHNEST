const { Events, EmbedBuilder } = require("discord.js");
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ChannelUpdate,
    once: false,
    async execute(oldChannel, newChannel) {
        const logChannel = newChannel.guild?.channels.cache.get(config.logsEventosCanal);
        if (!logChannel || !newChannel.guild) return;

        if (oldChannel.name === newChannel.name && oldChannel.topic === newChannel.topic) return;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("✏️ Canal editado")
            .addFields(
                oldChannel.name !== newChannel.name
                    ? { name: "Nombre", value: `**Antes:** ${oldChannel.name}\n**Ahora:** ${newChannel.name}` }
                    : {},
                oldChannel.topic !== newChannel.topic
                    ? { name: "Tema", value: `**Antes:** ${oldChannel.topic || "Ninguno"}\n**Ahora:** ${newChannel.topic || "Ninguno"}` }
                    : {}
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};
