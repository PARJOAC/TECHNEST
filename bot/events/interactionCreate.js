const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { errorEmbed } = require("../functions/defaultEmbed");
const { MessageType } = require("../../enums/messageType");
const { loadRequiredData } = require("../functions/getRequiredDatabase");
const Confesion = require("../../mongoDB/Confesion");
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

    if (!interaction) return;
    if (!interaction.guild)
      return errorEmbed(client, interaction, "Este comando solo se puede usar en un servidor.", MessageType.Reply);

    if (interaction.isButton()) {
      if (buttonsRoles.hasOwnProperty(interaction.customId)) {
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
      const [tipo, id] = interaction.customId.split("_");

      if (["anonymous", "reply"].includes(tipo) && id) {
        const modal = new ModalBuilder()
          .setCustomId(`${tipo}modal_${id}`)
          .setTitle(
            tipo === "anonymous"
              ? "Responder Anónimamente"
              : "Responder a la Confesión"
          );

        const input = new TextInputBuilder()
          .setCustomId("replyconfess")
          .setLabel("Escribe tu respuesta aquí:")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        return interaction.showModal(modal);
      }
      return;
    }

    if (interaction.isModalSubmit()) {
      const [tipoModal, id] = interaction.customId.split("_");
      const esAnonimo = tipoModal.includes("anonymous");
      const respuesta = interaction.fields.getTextInputValue("replyconfess");
      const guildId = interaction.guild.id;
      const userId = interaction.user.id;

      let confessionDoc = await Confesion.findOne({ guildId });
      if (!confessionDoc) {
        confessionDoc = await Confesion.create({
          guildId,
          last: 0,
          users: [],
        });
      }

      const newAnswerId = (parseInt(confessionDoc.last) + 1).toString();
      confessionDoc.last = newAnswerId;

      let confesionOriginal = null;
      let autorConfesionId = null;
      for (const user of confessionDoc.users) {
        const found = user.confessions.find((c) => c.id === id);
        if (found) {
          confesionOriginal = found;
          autorConfesionId = user.authorId;
          break;
        }
      }

      if (!confesionOriginal) {
        return interaction.reply({
          content: "No se encontró la confesión original.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const channel = interaction.guild.channels.cache.get(
        confessionDoc.channel
      );
      if (!channel) {
        return interaction.reply({
          content: "El canal de confesiones no está configurado correctamente.",
          flags: MessageFlags.Ephemeral,
        });
      }

      let mensajeOriginal = null;
      try {
        if (confesionOriginal.messageId) {
          mensajeOriginal = await channel.messages.fetch(
            confesionOriginal.messageId
          );
        }
      } catch (err) {
        mensajeOriginal = null;
      }

      const embed = new EmbedBuilder()
        .setTitle(`💬 Respuesta #${newAnswerId}`)
        .setDescription(respuesta)
        .setColor(0xadd8e6)
        .setTimestamp();

      if (esAnonimo) {
        embed.setFooter({
          text: "Respuesta anónima",
        });
      } else {
        embed.setFooter({
          text: `Respondido por ${interaction.user.tag}`,
        });
        embed.setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });
      }

      let mensajeRespuesta;
      if (mensajeOriginal) {
        mensajeRespuesta = await mensajeOriginal.reply({ embeds: [embed] });
      } else {
        mensajeRespuesta = await channel.send({ embeds: [embed] });
      }

      let userData = confessionDoc.users.find((u) => u.authorId === userId);
      if (!userData) {
        userData = { authorId: userId, confessions: [], answers: [] };
        confessionDoc.users.push(userData);
      }

      userData.answers.push({
        id: newAnswerId,
        responseTo: id,
        message: respuesta,
        date: new Date(),
        anonymous: esAnonimo,
        messageId: mensajeRespuesta.id,
      });

      await confessionDoc.save();

      if ((confessionDoc.dmStatus ?? true) && autorConfesionId) {
        try {
          const targetUser = await interaction.client.users.fetch(
            autorConfesionId
          );
          const dm = await targetUser.createDM();

          const messageUrl = confesionOriginal.messageId
            ? `https://discord.com/channels/${guildId}/${confessionDoc.channel}/${confesionOriginal.messageId}`
            : null;

          const dmEmbed = new EmbedBuilder()
            .setTitle(
              `📬 Alguien ha respondido a tu confesión (#${newAnswerId})`
            )
            .setDescription(respuesta)
            .setColor(0x90ee90)
            .setTimestamp();

          if (esAnonimo) {
            dmEmbed.setFooter({
              text: "Respuesta anónima",
            });
          } else {
            dmEmbed.setFooter({
              text: `Respondido por ${interaction.user.tag}`,
            });
            dmEmbed.setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            });
          }

          const components = [];

          if (messageUrl) {
            const viewButton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Ver confesión")
                .setStyle(ButtonStyle.Link)
                .setURL(messageUrl)
            );

            components.push(viewButton);
          }

          await dm.send({
            embeds: [dmEmbed],
            components: components,
          });
        } catch (err) { }
      }

      return interaction.reply({
        content: "Tu respuesta ha sido enviada correctamente.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (
      !interaction.replied &&
      !interaction.deferred &&
      command.defer !== false
    ) {
      await interaction.deferReply();
    }

    const db = await loadRequiredData(
      interaction,
      command.databaseRequired || []
    );

    try {
      await command.execute(interaction, client, { db });
    } catch (error) {
      console.log(error);
      if (interaction.deferred) {
        return errorEmbed(
          interaction,
          client,
          "Ha ocurrido un error al ejecutar el comando.",
          MessageType.EditReply
        );
      } else if (interaction.replied) {
        return errorEmbed(
          interaction,
          client,
          "Ha ocurrido un error al ejecutar el comando.",
          MessageType.FollowUp
        );
      } else {
        return errorEmbed(
          interaction,
          client,
          "Ha ocurrido un error al ejecutar el comando.",
          MessageType.Reply
        );
      }
    }

  },
};
