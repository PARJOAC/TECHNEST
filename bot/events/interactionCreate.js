const { Events } = require("discord.js");

const buttonsRoles = {
  SMR: "1107572341644480562",
  TELECO: "1107572397588107294",
  ASIR: "1107572531122155520",
  DAW: "1107572594552619038",
  DAM: "1107572573052600390",
  CIBERSEGURIDAD: "1107658851420999832",
  ING_INF: "1287088433512189972",
  IABG: "1249719462731452506",
  VR: "1249720896386502689",
  AUDIOVISUALES: "1107573065832992798",
  AFICIONADO: "1322345489789751296",
  PRESENCIAL: "1268294556558819561",
  SEMIPRESENCIAL: "1268294590528622755",
  ONLINE: "1268294630500466860",
  ANDALUCIA: "1267939687436255297",
  CANARIAS: "1267939748748460101",
  CANTABRIA: "1267939783569576001",
  CATALUNA: "1267939818235629578",
  COMUNIDAD_VALENCIANA: "1267940230984368290",
  GALICIA: "1267939847058882661",
  ISLAS_BALEARES: "1267939875294937139",
  LA_RIOJA: "1267939917905002642",
  NAVARRA: "1267939952994549780",
  PAIS_VASCO: "1267939988398669877",
  ARAGON: "1267940074562260992",
  CASTILLA_LA_MANCHA: "1267940126122573874",
  CASTILLA_LEON: "1267940186164301854",
  MADRID: "1267940326979403776",
  EXTREMADURA: "1267940277973422111",
  CEUTA: "1267940354750025832",
  MELILLA: "1267940385703985154",
  MURCIA: "1267940414892015746",
  ASTURIAS: "1267940446328459354",
  HOMBRE: "1277609733884477460",
  MUJER: "1277609779535151239",
  MINECRAFT: "1280265326168244255"
};

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client) {

    if (interaction.isButton()) {
      const rolId = buttonsRoles[interaction.customId];

      if (rolId) {
        const rol = interaction.guild.roles.cache.get(rolId);

        if (!rol) {
          return interaction.reply({
            content: "No se encontró el rol correspondiente.",
            ephemeral: true,
          });
        }

        if (interaction.member.roles.cache.has(rol.id)) {
          await interaction.member.roles.remove(rol.id);
          await interaction.reply({
            content: `¡Se te ha eliminado el rol <@&${rol.id}>!`,
            ephemeral: true,
          });
        } else {
          await interaction.member.roles.add(rol.id);
          await interaction.reply({
            content: `¡Rol <@&${rol.id}> asignado con éxito!`,
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({
          content: "El botón no está configurado correctamente.",
          ephemeral: true,
        });
      }
    }

    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "¡Hubo un error al ejecutar este comando! Por favor, repórtalo al desarrollador.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "¡Hubo un error al ejecutar este comando! Por favor, repórtalo al desarrollador.",
          ephemeral: true,
        });
      }
    }


  },
};
