const { Events, EmbedBuilder } = require('discord.js');
const config = require("../../initMain/config.json");
module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member, client) {
        const guild = await client.guilds.cache.get(config.guildId);
        const channel = await client.channels.cache.get(config.bienvenidaCanal);

        const embedBienvenida = new EmbedBuilder()
            .setColor("#fe81fe")
            .setTitle(`<a:peepopumpkindance:1287119445659091037> ¡Bienvenido a TechNest! ¡Nos Alegra que Estés Aquí ${member.user.username}! <a:peepopumpkindance:1287119445659091037>`)
            .setDescription(`🌟 ¡Tu Nueva Casa en el Universo Digital! 🌟\n\n🚀 ¡Prepárate para Sumergirte en el Mundo de la Informática con los Mejores! 🚀\n\nEn TechNest, nos apasiona la tecnología y estamos emocionados de compartir esta aventura contigo. Únete a nuestras vibrantes discusiones, accede a recursos increíbles y colabora en proyectos que desafiarán tu creatividad y habilidades. 🖥️💡\n\n**¿Qué encontrarás aquí?**\n\n💬 Debates y Discusiones sobre todo lo tecnológico.\n🛠️ Recursos y Tutoriales para todos los niveles.\n👩‍💻 Proyectos Colaborativos y grupos de estudio.\n🌟 Eventos Exclusivos como charlas y hackathons.\n🔔 Antes de comenzar, te invitamos a visitar nuestro canal de <#1247974410368061461> conocer las reglas de la comunidad. Y no olvides pasar por el canal de <#1107574606379880459> para personalizar tu experiencia y obtener acceso a las áreas que más te interesan. 🛡️⚙️\n\nSea cual sea tu nivel, TechNest es tu lugar para aprender, crecer y brillar en el mundo de la informática. ¡Estamos emocionados de tenerte a bordo!\n\n✨ ¡Vamos a Crear Juntos el Futuro Digital! ✨`)
            .setFooter({ text: `¡TechNest ya cuenta con ${guild.memberCount} entusiastas de la informática!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL())

        await channel.send({ content: `<@${member.user.id}>`, embeds: [embedBienvenida] })


    }
}
