const { SlashCommandBuilder } = require("discord.js");
const boton = require("../../../extras/boton.js");
const embed = require("../../../extras/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Enviar mensaje de autoroles"),
  category: "mod",
  usage: "Enviar mensaje de autoroles",
  n: "</roles:1276173928368181355>",
  async execute(interaction, client) {
    if (interaction.user.id !== "714376484139040809") return;
    await interaction.channel.send({
      embeds: [embed.categorias_imagen()],
      components: [boton.botones_categorias1(), boton.botones_categorias2(), boton.botones_categorias3()],
    });

    setTimeout(() => {
  
    }, 1000);
      
    await interaction.channel.send({
      embeds: [embed.curso()],
      components: [boton.botones_curso()],
    });

      setTimeout(() => {
  
    }, 1000);
      
    await interaction.channel.send({
      embeds: [embed.comunidad()],
      components: [
        boton.botones_comunidad1(),
        boton.botones_comunidad2(),
        boton.botones_comunidad3(),
        boton.botones_comunidad4(),
      ],
    });

      setTimeout(() => {
  
    }, 1000);
      
    await interaction.channel.send({
      embeds: [embed.genero()],
      components: [boton.botones_genero()],
    });

      setTimeout(() => {
  
    }, 1000);
      
    await interaction.channel.send({
      embeds: [embed.minecraft()],
      components: [boton.botones_minecraft()],
    });
  },
};
