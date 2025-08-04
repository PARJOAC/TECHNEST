const { EmbedBuilder } = require("discord.js");
const config = require("../../initMain/config.json");

async function registrarSancion({ guild, usuarioObjetivo, moderador, tipo, razon, duracion }) {
  const canalLogsId = config.logsModCanal;
  const canal = guild.channels.cache.get(canalLogsId);

  if (!canal || !canal.isTextBased()) return;

  const colores = {
    ban: 0x8b0000,         // rojo oscuro
    expulsion: 0xff8c00,   // naranja
    aislar: 0xffa500,      // naranja claro
    desaislar: 0x228b22,   // verde
    desbanear: 0x1e90ff,   // azul
  };

  const titulos = {
    ban: "🔨 Usuario baneado",
    expulsion: "👢 Usuario expulsado",
    aislar: "⛓️ Usuario aislado",
    desaislar: "🔓 Aislamiento retirado",
    desbanear: "♻️ Usuario desbaneado",
  };

  const embed = new EmbedBuilder()
    .setTitle(titulos[tipo] || `📢 Acción de moderación`)
    .setColor(colores[tipo] || 0x808080)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${usuarioObjetivo.id}/${usuarioObjetivo.avatar || "a"}.png`)
    .addFields(
      { name: "👤 Usuario", value: `<@${usuarioObjetivo.id}> \`${usuarioObjetivo.tag || "Usuario desconocido"}\``, inline: false },
      { name: "🛠️ Acción", value: `\`${tipo}\``, inline: true },
      { name: "👮 Moderador", value: `<@${moderador.id}> \`${moderador.tag}\``, inline: true },
      { name: "📝 Motivo", value: razon, inline: false },
    )
    .setFooter({ text: `${guild.name} • ${new Date().toLocaleString("es-ES")}` })
    .setTimestamp();

  if (duracion) {
    const formatearDuracion = (ms) => {
      const unidades = [
        { etiqueta: "sem", valor: 7 * 24 * 60 * 60 * 1000 },
        { etiqueta: "d", valor: 24 * 60 * 60 * 1000 },
        { etiqueta: "h", valor: 60 * 60 * 1000 },
        { etiqueta: "min", valor: 60 * 1000 },
        { etiqueta: "s", valor: 1000 },
      ];

      let restante = ms;
      const partes = [];

      for (const unidad of unidades) {
        const cantidad = Math.floor(restante / unidad.valor);
        if (cantidad > 0) {
          partes.push(`${cantidad}${unidad.etiqueta}`);
          restante -= cantidad * unidad.valor;
        }
      }

      return partes.join(" ");
    };

    embed.addFields({
      name: "⏱️ Duración",
      value: formatearDuracion(duracion),
      inline: true,
    });
  }

  await canal.send({ embeds: [embed] }).catch(() => { });
}

module.exports = { registrarSancion };
