// threadDelete.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ThreadDelete,
    once: false,
    async execute(thread) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🗑️ Hilo eliminado')
            .setDescription(`Se ha eliminado el hilo: **${thread.name}**`)
            .setTimestamp();

        const logsChannel = thread.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
