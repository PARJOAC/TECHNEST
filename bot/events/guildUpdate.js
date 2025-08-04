const { Events, EmbedBuilder } = require("discord.js");
const config = require('../../initMain/config.json');

module.exports = {
    name: Events.GuildUpdate,
    once: false,
    async execute(oldGuild, newGuild) {
        const logChannel = newGuild.channels.cache.get(config.logsEventosCanal);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔧 Servidor editado")
            .setTimestamp();

        if (oldGuild.name !== newGuild.name) {
            embed.addFields({
                name: "Nombre del servidor",
                value: `**Antes:** ${oldGuild.name}\n**Ahora:** ${newGuild.name}`
            });
        }

        if (oldGuild.iconURL() !== newGuild.iconURL()) {
            embed.setThumbnail(newGuild.iconURL());
            embed.addFields({
                name: "Icono del servidor",
                value: "🖼️ El icono del servidor fue cambiado."
            });
        }

        if (embed.data.fields?.length > 0) {
            logChannel.send({ embeds: [embed] });
        }
    }
};
