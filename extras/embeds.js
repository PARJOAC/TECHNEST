const { EmbedBuilder } = require("discord.js");

function createMessage(title, description) {
  return new EmbedBuilder()
    .setDescription(description)
    .setColor("Purple")
    .setTitle(title);
}

function createMessageImage(title, description, image) {
  return new EmbedBuilder()
    .setImage(image)
    .setColor("Purple")
    .setDescription(description)
    .setTitle(title);
}

module.exports = {
  categorias_imagen: () => createMessageImage(
    "¡Reacciona para obtener tus roles!", "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**💻 SMR\n📡 TELECO\n🌐 ASIR\n☕ DAW\n🎲 DAM\n👺 Ciberseguridad\n🤖 IA & BG\n🎮 Desarrollo Videojuegos y VR\n🎥 Audiovisuales\n🔧 Ingeniería informática\n📱 Aficionado**\n\nDEBES ESCOGER MÍNIMO 1 ROL OBLIGATORIAMENTE PARA QUE SE TE DESBLOQUEEN LOS CANALES." , "https://cdn.discordapp.com/attachments/1296027181322862644/1301307129247830088/Banner_de_perfil_para_Discord_arte_pixelado_magenta_violeta.png?ex=6729eef4&is=67289d74&hm=9a197fa812fa373538995783f0c887a3f50e13f8d6f6c034eb634df5096b21a4&"
  ),
  curso: () => createMessage("¡Reacciona para obtener tus roles!", "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**🏠 Presencial\n👀 SemiPresencial\n💻 Online**"),
  comunidad: () => createMessage("¡Reacciona para obtener tus roles!", "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**<:andalucia:1295425061439799316> Andalucía\n<:canarias:1295428474508415057> Canarias\n<:cantabria:1295428472386355245> Cantabria\n<:catalua:1295428471119544381> Cataluña\n<:valencia:1295428469571846315> Comunidad Valenciana\n<:galicia:1295427186408558642> Galicia\n<:IslasBaleares:1295427185045274705> Islas Baleares\n<:LaRioja:1295427183405432934> La Rioja\n<:Navarra:1295427181429657711> Navarra\n<:PasVasco:1295427179865182298> País Vasco\n<:Aragn:1295427178569138317> Aragón\n<:CastillaLaMancha:1295427177017380956> Castilla-La Mancha\n<:CastillayLen:1295427174953783337> Castilla y León\n<:Madrid:1295426641081798687> Madrid\n<:Extremadura:1295426639521386627> Extremadura\n<:Ceuta:1295426638321942588> Ceuta\n<:Melilla:1295426636648419488> Melilla\n<:Murcia:1295426635050520636> Murcia\n<:Asturias:1295426633473200268> Asturias**"),
  genero: () => createMessage("¡Reacciona para obtener tus roles!", "Reacciona al botón correspondiente para obtener o eliminar los roles pertinentes. ¡Buen curso!\n\n**👦🏻 Hombre\n👧🏻 Mujer**"),
  minecraft: () => createMessage("¡Reacciona para obtener tus roles!", "Reacciona al botón correspondiente para acceder al servidor de Minecraft.\n\n**💚 Minecraft**")
};
