const {
  userMention,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");
const { errorEmbed } = require("../../functions/defaultEmbed");
const { buildCommand } = require("../../functions/createSlashCommand");
const { CommandPermission, CommandOptionType } = require("../../../enums/buildCommand");
const { MessageType } = require("../../../enums/messageType");

module.exports = {
  data: buildCommand("check", "Herramienta interna para el propietario.", {
    commandPermission: CommandPermission.Administrator,
    options: [
      {
        name: "id",
        type: CommandOptionType.String,
        description: "ID de objetivo.",
        required: CommandOptionType.Required,
      },
    ],
  }),
  category: "confession",
  commandId: "1354425696231096391",
  admin: true,
  defer: false,
  databaseRequired: ["confessionData"],
  async execute(interaction, client, { db }) {
    const confessionData = db.confessionData;
    await interaction.deferReply({ ephemeral: true });

    const idBuscado = interaction.options.getString("id");
    const guildId = interaction.guild.id;

    let type = null;
    let entrance = null;
    let foundUser = null;

    for (const user of confessionData.users) {
      entrance = user.confessions.find((c) => c.id === idBuscado);
      if (entrance) {
        type = "Confesión";
        foundUser = user;
        break;
      }
    }

    if (!entrance) {
      for (const user of confessionData.users) {
        entrance = user.answers.find((a) => a.id === idBuscado);
        if (entrance) {
          type = "Respuesta";
          foundUser = user;
          break;
        }
      }
    }

    if (!entrance)
      return errorEmbed(
        interaction,
        client,
        "No se ha encontrado ninguna confesión o respuesta con ese ID.",
        MessageType.FollowUp
      );

    const autor = await interaction.client.users.fetch(foundUser.authorId);

    const actionRow = new ActionRowBuilder();
    if (entrance.messageId) {
      const messageUrl = `https://discord.com/channels/${guildId}/${confessionData.channel}/${entrance.messageId}`;
      const button = new ButtonBuilder()
        .setLabel("Ver mensaje")
        .setStyle(ButtonStyle.Link)
        .setURL(messageUrl);
      actionRow.addComponents(button);
    }

    const embed = new EmbedBuilder()
      .setTitle(`${type} #${idBuscado}`)
      .addFields(
        {
          name: "Contenido del mensaje",
          value:
            entrance.message && entrance.message.length > 400
              ? entrance.message.slice(0, 400) + "..."
              : entrance.message || "**No disponible**",
        },
        {
          name: "Fecha del mensaje",
          value: `<t:${Math.floor(
            new Date(entrance.date).getTime() / 1000
          )}:F>`,
          inline: true,
        },
        {
          name: "¿Es anónimo?",
          value: entrance.anonymous
            ? "✅ Sí"
            : "❌ No",
          inline: true,
        },
        {
          name: "Autor",
          value: `${autor.tag} (${userMention(autor.id)})`,
        },
        {
          name: "ID del autor",
          value: autor.id,
        },
        ...(type === "Respuesta"
          ? [
              {
                name: "ID de confesión",
                value:
                  entrance.responseTo || "**No disponible**",
              },
            ]
          : [])
      )
      .setFooter({ text: interaction.guild.name })
      .setThumbnail(
        autor?.displayAvatarURL() ||
          "https://cdn.discordapp.com/embed/avatars/0.png"
      )
      .setTimestamp()
      .setColor(0x2ecc71);

    await interaction.followUp({
      embeds: [embed],
      components: entrance.messageId ? [actionRow] : [],
      flags: MessageFlags.Ephemeral,
    });
  },
};
