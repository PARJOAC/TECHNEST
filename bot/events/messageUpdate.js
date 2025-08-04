const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage, client) {
        if (
            oldMessage.partial ||
            newMessage.partial ||
            oldMessage.author?.bot ||
            oldMessage.content === newMessage.content
        ) return;

        const channel = client.channels.cache.get(config.logsEventosCanal);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({ name: `✏️ Mensaje editado`, iconURL: oldMessage.author.displayAvatarURL() })
            .setDescription(`**Usuario:** <@${oldMessage.author.id}>`)
            .addFields(
                { name: "Canal", value: `<#${oldMessage.channel.id}>`, inline: true },
                { name: "Antes", value: oldMessage.content.slice(0, 1024) || "*Vacío*" },
                { name: "Después", value: newMessage.content.slice(0, 1024) || "*Vacío*" }
            )
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
