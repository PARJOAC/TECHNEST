const { userCanUseCommand } = require("../../functions/checkAdminCommand");
const { blueEmbed } = require("../../functions/interactionEmbed.js");
const { Category } = require("../../../enums/category");
const { MessageType } = require("../../../enums/messageType");
const { buildCommand } = require("../../functions/createSlashCommand");
const { createButton } = require("../../functions/createButton");
const { CommandPermission } = require("../../../enums/buildCommand.js");

module.exports = {
  data: buildCommand("roles", "Enviar mensaje de autoroles.", { CommandPermission: CommandPermission.Administrator }),
  category: Category.Assist,
  commandId: "1295292737184333864",
  async execute(interaction, client) {
    const check = await userCanUseCommand(interaction, client);
    if (!check.canDoCommand) return;

    const buttonsProfesiones = [
      { id: "SMR", label: "💻", style: "secondary" },
      { id: "TELECO", label: "📡", style: "secondary" },
      { id: "ASIR", label: "🌐", style: "secondary" },
      { id: "DAW", label: "☕", style: "secondary" },
      { id: "DAM", label: "🎲", style: "secondary" },
      { id: "CIBERSEGURIDAD", label: "👺", style: "secondary" },
      { id: "IABG", label: "🤖", style: "secondary" },
      { id: "VR", label: "🎮", style: "secondary" },
      { id: "AUDIOVISUALES", label: "🎥", style: "secondary" },
      { id: "ING_INF", label: "🔧", style: "secondary" },
      { id: "AFICIONADO", label: "📱", style: "secondary" },
    ];
    const actionRowProfesiones = await createButton(buttonsProfesiones);

    await blueEmbed(interaction, client, {
      type: MessageType.ChannelSend,
      title: "¿Qué módulos te gustan?",
      description: "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**💻 SMR\n📡 TELECO\n🌐 ASIR\n☕ DAW\n🎲 DAM\n👺 Ciberseguridad\n🤖 IA & BG\n🎮 Desarrollo Videojuegos y VR\n🎥 Audiovisuales\n🔧 Ingeniería informática\n📱 Aficionado**\n\nDEBES ESCOGER MÍNIMO 1 ROL OBLIGATORIAMENTE PARA QUE SE TE DESBLOQUEEN LOS CANALES.",
      withResponse: false,
      image: "https://media.discordapp.net/attachments/1352244145909006360/1397941331292065792/bienvenida.jpg?ex=68838dd1&is=68823c51&hm=5fed13e1887f816accc5bd399070d0e70d1cd0362c251ac4da851b85b59da7d3&=&format=webp",
      components: actionRowProfesiones,
    });

    setTimeout(() => {

    }, 1000);

    const buttonsEstado = [
      { id: "PRESENCIAL", label: "🏠", style: "secondary" },
      { id: "SEMIPRESENCIAL", label: "👀", style: "secondary" },
      { id: "ONLINE", label: "💻", style: "secondary" },
    ];
    const actionRowEstado = await createButton(buttonsEstado);

    await blueEmbed(interaction, client, {
      type: MessageType.ChannelSend,
      title: "¿Cómo estudias?",
      description: "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**🏠 Presencial\n👀 SemiPresencial\n💻 Online**",
      withResponse: false,
      components: actionRowEstado,
    });

    setTimeout(() => {

    }, 1000);

    const buttonsComunidad = [
      { id: "ANDALUCIA", label: "Andalucia", style: "secondary" },
      { id: "CANARIAS", label: "Canarias", style: "secondary" },
      { id: "CANTABRIA", label: "Cantabria", style: "secondary" },
      { id: "CATALUNA", label: "Cataluña", style: "secondary" },
      { id: "COMUNIDAD_VALENCIANA", label: "Comunidad Valenciana", style: "secondary" },
      { id: "GALICIA", label: "Galicia", style: "secondary" },
      { id: "ISLAS_BALEARES", label: "Islas Baleares", style: "secondary" },
      { id: "LA_RIOJA", label: "La Rioja", style: "secondary" },
      { id: "NAVARRA", label: "Navarra", style: "secondary" },
      { id: "PAIS_VASCO", label: "País Vasco", style: "secondary" },
      { id: "ARAGON", label: "Aragón", style: "secondary" },
      { id: "CASTILLA_LA_MANCHA", label: "Castilla-La Mancha", style: "secondary" },
      { id: "CASTILLA_LEON", label: "Castilla y León", style: "secondary" },
      { id: "MADRID", label: "Madrid", style: "secondary" },
      { id: "EXTREMADURA", label: "Extremadura", style: "secondary" },
      { id: "CEUTA", label: "Ceuta", style: "secondary" },
      { id: "MELILLA", label: "Melilla", style: "secondary" },
      { id: "MURCIA", label: "Murcia", style: "secondary" },
      { id: "ASTURIAS", label: "Asturias", style: "secondary" },
    ];
    const actionRowComunidad = await createButton(buttonsComunidad);

    await blueEmbed(interaction, client, {
      type: MessageType.ChannelSend,
      title: "¿De qué comunidad eres?",
      description: "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**<:andalucia:1295425061439799316> Andalucía\n<:canarias:1295428474508415057> Canarias\n<:cantabria:1295428472386355245> Cantabria\n<:catalua:1295428471119544381> Cataluña\n<:valencia:1295428469571846315> Comunidad Valenciana\n<:galicia:1295427186408558642> Galicia\n<:IslasBaleares:1295427185045274705> Islas Baleares\n<:LaRioja:1295427183405432934> La Rioja\n<:Navarra:1295427181429657711> Navarra\n<:PasVasco:1295427179865182298> País Vasco\n<:Aragn:1295427178569138317> Aragón\n<:CastillaLaMancha:1295427177017380956> Castilla-La Mancha\n<:CastillayLen:1295427174953783337> Castilla y León\n<:Madrid:1295426641081798687> Madrid\n<:Extremadura:1295426639521386627> Extremadura\n<:Ceuta:1295426638321942588> Ceuta\n<:Melilla:1295426636648419488> Melilla\n<:Murcia:1295426635050520636> Murcia\n<:Asturias:1295426633473200268> Asturias**",
      withResponse: false,
      components: actionRowComunidad,
    });

    setTimeout(() => {

    }, 1000);

    const buttonsGenero = [
      { id: "HOMBRE", label: "👦🏻", style: "secondary" },
      { id: "MUJER", label: "👧🏻", style: "secondary" },
    ];
    const actionRowGenero = await createButton(buttonsGenero);

    await blueEmbed(interaction, client, {
      type: MessageType.ChannelSend,
      title: "¿Con qué género te identificas?",
      description: "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**👦🏻 Hombre\n👧🏻 Mujer**",
      withResponse: false,
      components: actionRowGenero,
    });

    setTimeout(() => {

    }, 1000);

    const buttonsMinecraft = [
      { id: "MINECRAFT", label: "💚", style: "secondary" },
    ];
    const actionRowMinecraft = await createButton(buttonsMinecraft);

    await blueEmbed(interaction, client, {
      type: MessageType.ChannelSend,
      title: "¿Quieres unirte a nuestro servidor de minecraft?",
      description: "Reacciona al botón correspondiente para acceder al servidor de Minecraft.\n\n**💚 Minecraft**",
      withResponse: false,
      components: actionRowMinecraft,
    });

    await blueEmbed(interaction, client, {
      type: MessageType.EditReply,
      title: "¡Listo!",
      description: "Se han enviado correctamente los botones de autoroles.",
      withResponse: true,
    });
  },
};
