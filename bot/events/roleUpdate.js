// roleUpdate.js
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.GuildRoleUpdate,
    once: false,
    async execute(oldRole, newRole) {
        if (oldRole.name === newRole.name) return;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('✏️ Rol actualizado')
            .addFields(
                { name: 'Nombre anterior', value: oldRole.name },
                { name: 'Nuevo nombre', value: newRole.name }
            )
            .setTimestamp();

        const logsChannel = newRole.guild.channels.cache.get(config.logsEventosCanal);
        if (logsChannel) logsChannel.send({ embeds: [embed] });
    }
};
