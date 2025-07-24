const { SlashCommandBuilder } = require("discord.js");
const { CommandOptionType } = require("../../enums/buildCommand");

function buildCommand(
  commandName,
  commandDescription,
  { commandPermission, options } = {}
) {
  const slashCommand = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(commandDescription);

  if (commandPermission) {
    const permissionValue = commandPermission || null;
    if (permissionValue) {
      slashCommand.setDefaultMemberPermissions(permissionValue);
    } else {
      throw new Error(`Permiso no válido: ${commandPermission}`);
    }
  }

  if (options && Array.isArray(options)) {
    options.forEach((option) => {
      switch (option.type) {
        case CommandOptionType.String:
          slashCommand.addStringOption((opt) => {
            let stringOption = opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false);

            if (option.choices && Array.isArray(option.choices)) {
              stringOption = stringOption.addChoices(
                ...option.choices.map((choice) => ({
                  name: choice.name,
                  value: choice.value,
                }))
              );
            }

            return stringOption;
          });
          break;
        case CommandOptionType.Integer:
          slashCommand.addIntegerOption((opt) => {
            let intOption = opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false);

            if (option.valueMin !== undefined)
              intOption = intOption.setMinValue(option.valueMin);
            if (option.valueMax !== undefined)
              intOption = intOption.setMaxValue(option.valueMax);

            return intOption;
          });
          break;
        case CommandOptionType.Boolean:
          slashCommand.addBooleanOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.User:
          slashCommand.addUserOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.Channel:
          slashCommand.addChannelOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.Role:
          slashCommand.addRoleOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.Mentionable:
          slashCommand.addMentionableOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.Number:
          slashCommand.addNumberOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        case CommandOptionType.Attachment:
          slashCommand.addAttachmentOption((opt) =>
            opt
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required ?? false)
          );
          break;
        default:
          throw new Error(`Tipo de opción no soportado: ${option.type}`);
      }
    });
  }

  return slashCommand;
}

module.exports = { buildCommand };
