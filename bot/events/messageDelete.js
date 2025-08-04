const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(message, client) {
        if (message.partial || message.author?.bot) return;

        const channel = client.channels.cache.get(config.logsEventosCanal);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `🗑️ Mensaje eliminado`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`**Usuario:** <@${message.author.id}>\n**Canal:** <#${message.channel.id}>`)
            .addFields({ name: "Contenido", value: message.content?.slice(0, 1024) || "*Vacío*" })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
