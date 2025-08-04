// roleDelete.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.GuildRoleDelete,
    once: false,
    async execute(role) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Rol eliminado')
            .setDescription(`Se ha eliminado el rol: **${role.name}**`)
            .setTimestamp();

        const logsChannel = role.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
