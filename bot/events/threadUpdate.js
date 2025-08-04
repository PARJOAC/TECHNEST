// threadUpdate.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ThreadUpdate,
    once: false,
    async execute(oldThread, newThread) {
        if (oldThread.name === newThread.name) return;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('✏️ Hilo actualizado')
            .addFields(
                { name: 'Nombre anterior', value: oldThread.name },
                { name: 'Nuevo nombre', value: newThread.name }
            )
            .setTimestamp();

        const logsChannel = newThread.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
