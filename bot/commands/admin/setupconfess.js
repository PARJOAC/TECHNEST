const { errorEmbed } = require("../../functions/defaultEmbed");
const { buildCommand } = require("../../functions/createSlashCommand");
const { greenEmbed } = require("../../functions/interactionEmbed");
const { CommandPermission, CommandOptionType, CommandOptionRequired } = require("../../../enums/buildCommand");
const { MessageType } = require("../../../enums/messageType");

module.exports = {
  data: buildCommand(
    "setupconfess",
    "Configurar el sistema de confesión para el servidor.",
    {
      commandPermission: CommandPermission.Administrator,
      options: [
        {
          name: "status",
          type: CommandOptionType.Boolean,
          description: "¿Activar o desactivar el sistema de confesión?",
          required: CommandOptionRequired.NotRequired,
        },
        {
          name: "dm_autor",
          type: CommandOptionType.Boolean,
          description: "¿Enviar DM al autor cuando alguien responde?",
          required: CommandOptionRequired.NotRequired,
        },
        {
          name: "channel",
          type: CommandOptionType.Channel,
          channeltype: "text",
          description: "Canal donde se enviarán las confesiones.",
          required: CommandOptionRequired.NotRequired,
        },
      ],
    }
  ),
  category: "confession",
  commandId: "1397973576912605195",
  databaseRequired: ["confessionData"],
  admin: false,
  async execute(interaction, client, { db }) {
    const confessionData = db.confessionData;

    const confessStatus = interaction.options.getBoolean("status");
    const dmStatus = interaction.options.getBoolean("dm_autor");
    const channelConfess = interaction.options.getChannel("channel");

    const updateFields = {};

    if (confessStatus !== null) updateFields.confessStatus = confessStatus;
    if (dmStatus !== null) updateFields.dmStatus = dmStatus;
    if (channelConfess) updateFields.channelConfess = channelConfess.id;

    if (Object.keys(updateFields).length === 0)
      return errorEmbed(
        interaction,
        client,
        "Debes especificar al menos un campo para actualizar.",
        MessageType.EditReply
      );

    confessionData.status = confessStatus ?? confessionData.status;
    confessionData.dmStatus = dmStatus ?? confessionData.dmStatus;
    confessionData.channel = channelConfess?.id ?? confessionData.channel;
    confessionData.save();

    return greenEmbed(interaction, client, {
      type: MessageType.EditReply,
      title: "Configuración de confesiones actualizada",
      description: `El sistema de confesiones ha sido ${confessStatus ? "activado" : "desactivado"}.\n` +
        `DM a autores: ${dmStatus ? "Activado" : "Desactivado"}\n` +
        `Canal de confesiones: ${channelConfess ? `<#${channelConfess.id}>` : "No especificado"}`,
    });
  },
};
