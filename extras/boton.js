const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function createButtons(botones) {
  return new ActionRowBuilder().addComponents(
    botones.map(button => (
      new ButtonBuilder()
        .setCustomId(button.id)
        .setLabel(button.label)
        .setStyle(button.style)
    ))
  );
}

function createButtonsEmoji(botones) {
  return new ActionRowBuilder().addComponents(
    botones.map(button => (
      new ButtonBuilder()
        .setCustomId(button.id)
        .setEmoji(button.emoji)
        .setStyle(button.style)
    ))
  );
}

module.exports = {
  botones_ayuda: () => createButtonsEmoji([
    { id: "GENERAL", emoji: "🌎", style: ButtonStyle.Secondary },
  ]),
  botones_categorias1: () => createButtonsEmoji([
    { id: "SMR", emoji: "💻", style: ButtonStyle.Secondary },
    { id: "TELECO", emoji: "📡", style: ButtonStyle.Secondary },
    { id: "ASIR", emoji: "🌐", style: ButtonStyle.Secondary },
    { id: "DAW", emoji: "☕", style: ButtonStyle.Secondary },
    { id: "DAM", emoji: "🎲", style: ButtonStyle.Secondary },
    ]),
    botones_categorias2: () => createButtonsEmoji([
    { id: "CIBERSEGURIDAD", emoji: "👺", style: ButtonStyle.Secondary },
    { id: "IABG", emoji: "🤖", style: ButtonStyle.Secondary },
    { id: "VR", emoji: "🎮", style: ButtonStyle.Secondary },
    { id: "AUDIOVISUALES", emoji: "🎥", style: ButtonStyle.Secondary },
    { id: "ING_INF", emoji: "🔧", style: ButtonStyle.Secondary },
  ]),
   botones_categorias3: () => createButtonsEmoji([
    { id: "AFICIONADO", emoji: "📱", style: ButtonStyle.Secondary },
  ]),
  botones_curso: () => createButtonsEmoji([
    { id: "PRESENCIAL", emoji: "🏠", style: ButtonStyle.Secondary },
    { id: "SEMIPRESENCIAL", emoji: "👀", style: ButtonStyle.Secondary },
    { id: "ONLINE", emoji: "💻", style: ButtonStyle.Secondary },
  ]),
  botones_comunidad1: () => createButtons([
    { id: "ANDALUCIA", label: "Andalucia", style: ButtonStyle.Secondary },
    { id: "CANARIAS", label: "Canarias", style: ButtonStyle.Secondary },
    { id: "CANTABRIA", label: "Cantabria", style: ButtonStyle.Secondary },
    { id: "CATALUNA", label: "Cataluña", style: ButtonStyle.Secondary },
    { id: "COMUNIDAD_VALENCIANA", label: "Comunidad Valenciana", style: ButtonStyle.Secondary },
  ]),
    botones_comunidad2: () => createButtons([
    { id: "GALICIA", label: "Galicia", style: ButtonStyle.Secondary },
    { id: "ISLAS_BALEARES", label: "Islas Baleares", style: ButtonStyle.Secondary },
    { id: "LA_RIOJA", label: "La Rioja", style: ButtonStyle.Secondary },
    { id: "NAVARRA", label: "Navarra", style: ButtonStyle.Secondary },
    { id: "PAIS_VASCO", label: "País Vasco", style: ButtonStyle.Secondary },
  ]),
    botones_comunidad3: () => createButtons([
    { id: "ARAGON", label: "Aragón", style: ButtonStyle.Secondary },
    { id: "CASTILLA_LA_MANCHA", label: "Castilla-La Mancha", style: ButtonStyle.Secondary },
    { id: "CASTILLA_LEON", label: "Castilla y León", style: ButtonStyle.Secondary },
    { id: "MADRID", label: "Madrid", style: ButtonStyle.Secondary },
    { id: "EXTREMADURA", label: "Extremadura", style: ButtonStyle.Secondary },
  ]),
    botones_comunidad4: () => createButtons([
    { id: "CEUTA", label: "Ceuta", style: ButtonStyle.Secondary },
    { id: "MELILLA", label: "Melilla", style: ButtonStyle.Secondary },
    { id: "MURCIA", label: "Murcia", style: ButtonStyle.Secondary },
    { id: "ASTURIAS", label: "Asturias", style: ButtonStyle.Secondary },
  ]),
  botones_genero: () => createButtonsEmoji([
    { id: "HOMBRE", emoji: "👦🏻", style: ButtonStyle.Secondary },
    { id: "MUJER", emoji: "👧🏻", style: ButtonStyle.Secondary },
  ]),
  botones_minecraft: () => createButtonsEmoji([
    { id: "MINECRAFT", emoji: "💚", style: ButtonStyle.Secondary },
  ])
}
