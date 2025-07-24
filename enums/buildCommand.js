const { PermissionFlagsBits } = require("discord.js");

const CommandPermission = {
  Administrator: PermissionFlagsBits.Administrator,
  ManageMessages: PermissionFlagsBits.ManageMessages,
  ManageGuild: PermissionFlagsBits.ManageGuild,
  BanMembers: PermissionFlagsBits.BanMembers,
  KickMembers: PermissionFlagsBits.KickMembers,
  ManageChannels: PermissionFlagsBits.ManageChannels,
  ManageRoles: PermissionFlagsBits.ManageRoles,
};

const CommandOptionType = {
  String: "string",
  Integer: "integer",
  Boolean: "boolean",
  User: "user",
  Channel: "channel",
  Role: "role",
  Mentionable: "mentionable",
  Number: "number",
  Attachment: "attachment",
};

const CommandOptionRequired = {
  Required: true,
  NotRequired: false,
};

module.exports = {
  CommandPermission,
  CommandOptionType,
  CommandOptionRequired,
};
