const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ChannelUpdate,
    once: false,
    async execute(oldChannel, newChannel) {
        if (oldChannel.name === newChannel.name) return;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('✏️ Canal actualizado')
            .setDescription(`Se cambió el nombre del canal`)
            .addFields(
                { name: 'Anterior', value: oldChannel.name, inline: true },
                { name: 'Nuevo', value: newChannel.name, inline: true }
            )
            .setTimestamp();

        const logsChannel = newChannel.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
