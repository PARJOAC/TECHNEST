// threadCreate.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ThreadCreate,
    once: false,
    async execute(thread) {
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('🧵 Hilo creado')
            .setDescription(`Se ha creado un hilo: **${thread.name}** en <#${thread.parentId}>`)
            .setTimestamp();

        const logsChannel = thread.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
