const { Events, EmbedBuilder } = require("discord.js");
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember) {
        const logChannel = newMember.guild.channels.cache.get(config.logsEventosCanal);
        if (!logChannel || oldMember.user.bot) return;

        const oldRoles = oldMember.roles.cache.map(r => r.id);
        const newRoles = newMember.roles.cache.map(r => r.id);

        const addedRoles = newRoles.filter(r => !oldRoles.includes(r));
        const removedRoles = oldRoles.filter(r => !newRoles.includes(r));

        if (addedRoles.length === 0 && removedRoles.length === 0) return;

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("🔁 Cambios de roles")
            .setDescription(`<@${newMember.id}> (${newMember.user.tag})`)
            .addFields(
                addedRoles.length ? { name: "➕ Roles añadidos", value: addedRoles.map(id => `<@&${id}>`).join(", ") } : {},
                removedRoles.length ? { name: "➖ Roles eliminados", value: removedRoles.map(id => `<@&${id}>`).join(", ") } : {}
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};
