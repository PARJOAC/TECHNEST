const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    async execute(oldUser, newUser) {
        const cambios = [];

        if (oldUser.username !== newUser.username)
            cambios.push(`👤 **Nombre:** \`${oldUser.username}\` → \`${newUser.username}\``);

        if (oldUser.discriminator !== newUser.discriminator)
            cambios.push(`🏷️ **Tag:** \`${oldUser.discriminator}\` → \`${newUser.discriminator}\``);

        if (oldUser.avatar !== newUser.avatar)
            cambios.push(`🖼️ **Avatar cambiado**`);

        if (cambios.length === 0) return;

        const channel = newUser.client.channels.cache.get(config.logsEventosCanal);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `🔄 Actualización de usuario`, iconURL: newUser.displayAvatarURL() })
            .setDescription(`<@${newUser.id}>`)
            .addFields({ name: "Cambios", value: cambios.join("\n") })
            .setThumbnail(newUser.displayAvatarURL())
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
