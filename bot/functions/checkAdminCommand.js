const { errorEmbed } = require("./defaultEmbed");
const config = require("../../initMain/config.json");
const { MessageType } = require("../../enums/messageType");

/**
 * Checks if a user can use a specific command based on the guild's economy type and user ID.
 *
 * @param {Object} interaction - The interaction object from the Discord API.
 * @param {Object} lang - The language object containing localized strings.
 * @param {Object} client - The Discord client instance.
 * @returns {Promise<Object>} - An object containing the status and optionally the guild data.
 */
async function userCanUseCommand(interaction, client) {
    if (interaction.user.id !== config.ownerId) {
        await errorEmbed(
            interaction,
            client,
            "Solo el creador del bot puede usar este comando.",
            MessageType.EditReply
        );
        return { canDoCommand: false };
    }

    return { canDoCommand: true };
}

module.exports = { userCanUseCommand };
