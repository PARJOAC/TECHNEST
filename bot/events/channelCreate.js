const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.ChannelCreate,
    once: false,
    async execute(channel) {
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('📗 Canal creado')
            .setDescription(`Se ha creado el canal <#${channel.id}>`)
            .addFields({ name: 'Nombre', value: channel.name, inline: true })
            .setTimestamp();

        const logsChannel = channel.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
