// roleCreate.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.GuildRoleCreate,
    once: false,
    async execute(role) {
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('➕ Rol creado')
            .setDescription(`Se ha creado el rol: **${role.name}**`)
            .setTimestamp();

        const logsChannel = role.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
