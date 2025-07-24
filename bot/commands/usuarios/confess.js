const { errorEmbed } = require("../../functions/defaultEmbed");
const { buildCommand } = require("../../functions/createSlashCommand");
const { createButton } = require("../../functions/createButton");
const { greenEmbed } = require("../../functions/interactionEmbed");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const path = require("path");
const config = require("../../../initMain/config.json");

const { CommandOptionType, CommandOptionRequired } = require("../../../enums/buildCommand");
const { MessageType } = require("../../../enums/messageType");

module.exports = {
  data: buildCommand("confess", "Enviar una confesión.", {
    options: [
      {
        name: "confession",
        type: CommandOptionType.String,
        description: "Escribe tu confesión.",
        required: CommandOptionRequired.Required,
      },
      {
        name: "anonymous",
        type: CommandOptionType.Boolean,
        description: "¿Quieres que sea anónimo? (predeterminado: si)",
        required: CommandOptionRequired.NotRequired,
      },
    ],
  }),
  category: "confession",
  admin: false,
  defer: false,
  databaseRequired: ["confessionData"],
  commandId: "1397973576912605196",
  async execute(interaction, client, { db }) {
    await interaction.deferReply({ ephemeral: true });

    const confessionData = db.confessionData;
    const userId = interaction.user.id;
    const message = interaction.options.getString("confession");
    const anonymous = interaction.options.getBoolean("anonymous") ?? true;

    if (!confessionData?.status || !confessionData.channel)
      return errorEmbed(
        interaction,
        client,
        "⚠️ El canal de confesión no está configurado o el estado es deshabilitado.",
        MessageType.EditReply
      );

    if (message.length > 2048)
      return errorEmbed(
        interaction,
        client,
        "Tu confesión es demasiado larga. Máximo permitido: 2048 caracteres.",
        MessageType.EditReply
      );

    const channel = interaction.guild.channels.cache.get(confessionData.channel);
    if (!channel)
      return errorEmbed(
        interaction,
        client,
        "⚠️ No se pudo encontrar el canal de confesión.",
        MessageType.EditReply
      );

    const newId = (parseInt(confessionData.last) + 1).toString();
    confessionData.last = newId;

    const categoryButtons = [
      { label: "📩 Responder", style: "primary", id: `reply_${newId}` },
      { label: "🕵️ Responder anónimamente", style: "secondary", id: `anonymous_${newId}` },
    ];
    const buttonRows = await createButton(categoryButtons);

    let attachment = null;
    let thumbnailUrl = null;

    if (anonymous) {
      const filePath = path.join(__dirname, "../../img/confess/confesionAnonima.png");
      attachment = new AttachmentBuilder(filePath, { name: "confesionAnonima.png" });
      thumbnailUrl = "attachment://confesionAnonima.png";
    } else {
      thumbnailUrl = interaction.user.displayAvatarURL();
    }

    const embed = new EmbedBuilder()
      .setTitle(`📢 New Confession (#${newId})`)
      .setDescription(message)
      .setTimestamp()
      .setColor(parseInt(config.greenColor, 16))
      .setThumbnail(thumbnailUrl);

    if (!anonymous) {
      embed.setFooter({ text: interaction.user.tag });
      embed.setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      });
    }

    const messageSent = await channel.send({
      embeds: [embed],
      files: attachment ? [attachment] : [],
      components: buttonRows,
    });

    let userData = confessionData.users.find((u) => u.authorId === userId);

    if (!userData) {
      confessionData.users.push({
        authorId: userId,
        confessions: [
          {
            id: newId,
            message,
            date: new Date(),
            anonymous,
            messageId: messageSent.id,
          },
        ],
        answers: [],
      });
    } else {
      userData.confessions.push({
        id: newId,
        message,
        date: new Date(),
        anonymous,
        messageId: messageSent.id,
      });
    }

    await confessionData.save();

    await greenEmbed(interaction, client, {
      type: MessageType.FollowUp,
      title: "✅ ¡Confesión enviada!",
      description: `Tu confesión ha sido enviada al servidor. Puedes verlo en el canal <#${confessionData.channel}>.`,
      withResponse: true,
    });
  },

};
