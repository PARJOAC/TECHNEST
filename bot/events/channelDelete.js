const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ChannelDelete,
    once: false,
    async execute(channel) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🗑️ Canal eliminado')
            .setDescription(`Se ha eliminado un canal: \`${channel.name}\``)
            .setTimestamp();

        const logsChannel = channel.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
