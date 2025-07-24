const { EmbedBuilder, MessageFlags } = require("discord.js");
const config = require("../../initMain/config.json");
const { MessageType } = require("../../enums/messageType");

async function interactionEmbed({
  title,
  url,
  description,
  fields = [],
  thumbnail,
  image,
  footer,
  color,
  client,
}) {
  if (!client)
    throw new Error("Client instance is required for interactionEmbed.");

  const embed = new EmbedBuilder().setTimestamp();

  if (url) embed.setURL(url);
  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (color) embed.setColor(color);
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  footer
    ? embed.setFooter({ text: footer, iconURL: client.user.displayAvatarURL() })
    : embed.setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    });

  if (fields.length > 0) embed.addFields(fields);

  return embed;
}

async function redEmbed(
  interaction,
  client,
  {
    type = "",
    url = "",
    title = "",
    description = "",
    fields = [],
    thumbnail = null,
    image = null,
    footer = null,
    withResponse = null,
    components = [],
  } = {}
) {
  return sendEmbed(interaction, client, {
    type: type,
    url: url,
    title: title,
    description: description,
    fields: fields,
    thumbnail: thumbnail,
    image: image,
    footer: footer,
    color: parseInt(config.redColor, 16),
    withResponse: withResponse,
    components: components,
  });
}

async function greenEmbed(
  interaction,
  client,
  {
    type = "",
    url = "",
    title = "",
    description = "",
    fields = [],
    thumbnail = null,
    image = null,
    footer = null,
    withResponse = null,
    components = [],
  } = {}
) {
  return sendEmbed(interaction, client, {
    type: type,
    url: url,
    title: title,
    description: description,
    fields: fields,
    thumbnail: thumbnail,
    image: image,
    footer: footer,
    color: parseInt(config.greenColor, 16),
    withResponse: withResponse,
    components: components,
  });
}

async function blueEmbed(
  interaction,
  client,
  {
    type = "",
    url = "",
    title = "",
    description = "",
    fields = [],
    thumbnail = null,
    image = null,
    footer = null,
    withResponse = null,
    components = [],
  } = {}
) {
  return sendEmbed(interaction, client, {
    type: type,
    url: url,
    title: title,
    description: description,
    fields: fields,
    thumbnail: thumbnail,
    image: image,
    footer: footer,
    color: parseInt(config.blueColor, 16),
    withResponse: withResponse,
    components: components,
  });
}

async function yellowEmbed(
  interaction,
  client,
  {
    type = "",
    url = "",
    title = "",
    description = "",
    fields = [],
    thumbnail = null,
    image = null,
    footer = null,
    withResponse = null,
    components = [],
  } = {}
) {
  return sendEmbed(interaction, client, {
    type: type,
    url: url,
    title: title,
    description: description,
    fields: fields,
    thumbnail: thumbnail,
    image: image,
    footer: footer,
    color: parseInt(config.yellowColor, 16),
    withResponse: withResponse,
    components: components,
  });
}

/**
 * Sends an embed message using the specified interaction method.
 *
 * @param {Object} interaction - The interaction object from Discord.
 * @param {Object} client - The Discord client instance.
 * @param {Object} options - The options for the embed message.
 * @param {string} options.type - The type of interaction method to use (e.g., "reply", "editReply").
 * @param {string} options.title - The title of the embed.
 * @param {string} options.description - The description of the embed.
 * @param {Array<Object>} options.fields - The fields to include in the embed.
 * @param {string} options.thumbnail - The URL of the thumbnail image.
 * @param {string} options.footer - The footer text of the embed.
 * @param {string} options.color - The color of the embed.
 * @param {boolean} options.withResponse - Whether the message should be ephemeral.
 * @param {Array<Object>} [options.components=[]] - The components to include with the message.
 * @returns {Promise<Object>} The sent message object.
 * @throws {Error} If an invalid method type is provided.
 */
async function sendEmbed(
  interaction,
  client,
  {
    type,
    url,
    title,
    description,
    fields,
    thumbnail,
    image,
    footer,
    color,
    withResponse,
    components = [],
  }
) {
  const embed = await interactionEmbed({
    url: url,
    title: title,
    description: description,
    fields: fields,
    thumbnail: thumbnail,
    image: image,
    footer: footer,
    color: color,
    client: client,
  });

  const methods = {
    [MessageType.EditReply]: interaction.editReply
      ? interaction.editReply.bind(interaction)
      : undefined,
    [MessageType.FollowUp]: interaction.followUp
      ? interaction.followUp.bind(interaction)
      : undefined,
    [MessageType.Edit]: interaction.edit
      ? interaction.edit.bind(interaction)
      : undefined,
    [MessageType.Update]: interaction.update
      ? interaction.update.bind(interaction)
      : undefined,
    [MessageType.Reply]: interaction.reply
      ? interaction.reply.bind(interaction)
      : undefined,
    [MessageType.ChannelSend]:
      interaction.channel && interaction.channel.send
        ? interaction.channel.send.bind(interaction.channel)
        : undefined,
    [MessageType.UserSend]:
      interaction.user && interaction.user.send
        ? interaction.user.send.bind(interaction.user)
        : undefined,
  };

  if (!type) {
    const channel = client.guilds.cache
      .get(config.guildId)
      .channels.cache.get(interaction);

    if (!channel || !channel.isTextBased()) return;

    return channel.send({ embeds: [embed], components: components });
  }

  const method = methods[type];
  if (!method) throw new Error(`Invalid method on sendEmbed: ${type}`);

  if (!withResponse) withResponse = false;

  return method({
    embeds: [embed],
    flags: withResponse ? MessageFlags.Ephemeral : null,
    components: components,
  });
}

module.exports = {
  redEmbed,
  greenEmbed,
  blueEmbed,
  yellowEmbed,
};
