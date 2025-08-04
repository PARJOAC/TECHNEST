const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    async execute(oldUser, newUser, client) {
        const changes = [];

        if (oldUser.username !== newUser.username)
            changes.push(`👤 **Nombre:** \`${oldUser.username}\` → \`${newUser.username}\``);

        if (oldUser.tag !== newUser.tag)
            changes.push(`🏷️ **Tag:** \`${oldUser.tag}\` → \`${newUser.tag}\``);

        if (oldUser.avatar !== newUser.avatar)
            changes.push(`🖼️ **Avatar cambiado**`);

        if (changes.length === 0) return;

        const channel = client.channels.cache.get(config.logsEventosCanal);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `🔄 Actualización de usuario`, iconURL: newUser.displayAvatarURL() })
            .setDescription(`<@${newUser.id}>`)
            .addFields({ name: "Cambios", value: changes.join("\n") })
            .setThumbnail(newUser.displayAvatarURL())
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
