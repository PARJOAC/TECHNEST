const { buildCommand } = require("../../functions/createSlashCommand");
const fs = require("fs");
const path = require("path");
const { blueEmbed } = require("../../functions/interactionEmbed");
const { createButton } = require("../../functions/createButton");
const config = require("../../../initMain/config.json");
const { Category } = require("../../../enums/category");
const { MessageType } = require("../../../enums/messageType");

module.exports = {
  data: buildCommand("help", "Mostrar los comandos disponibles."),
  category: Category.Assist,
  commandId: "1296240894306943039",
  async execute(interaction, client) {
    const commandFolders = fs
      .readdirSync(path.join(__dirname, "..", "..", "commands"))
      .filter((folder) => folder.admin !== true);

    const commandCategories = {};

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, "..", "..", "commands", folder))
        .filter((file) => file.endsWith(".js"));

      commandCategories[folder] = [];
      for (const file of commandFiles) {
        try {
          const command = require(path.join(
            __dirname,
            "..",
            "..",
            "commands",
            folder,
            file
          ));
          if (command.admin) continue;

          commandCategories[folder].push({
            name: command.data.name,
            description: command.data.description,
            commandId: command.commandId,
          });
        } catch (error) {
          console.error(`Error al cargar el comando ${file}:`, error);
        }
      }
    }

    const orderedCategories = [
      Category.Admin,
      Category.Assist,
      Category.General,
      Category.Users,
      Category.Moderation,
    ];

    const categoryEmojiMap = {
      admin: "⚙️",
      asistencia: "❓",
      general: "🟢",
      usuarios: "👤",
      moderacion: "🔨",
    };

    const categoryEmbeds = orderedCategories
      .map((category) => {
        if (!commandCategories[category]) return null;

        const commandList =
          commandCategories[category]
            .map(
              (command) =>
                `</${command.name}:${command.commandId}> \`\`->\`\` ${command.description}`
            )
            .join("\n\n") || "No hay comandos disponibles en esta categoría.";

        return {
          title: `${categoryEmojiMap[category]} | ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          description: commandList,
          color: parseInt(config.blueColor, 16),
        };
      })
      .filter(Boolean);

    const categoryButtons = orderedCategories.map((category, index) => ({
      id: `category_${index}`,
      label: `${categoryEmojiMap[category]} ${category.charAt(0).toUpperCase() + category.slice(1) || "More"}`,
      style: "primary",
    }));

    const buttonRows = await createButton(categoryButtons);

    const message = await blueEmbed(interaction, client, {
      type: MessageType.EditReply,
      title: "✨ ¡Bienvenido a la Sección de Ayuda! ✨",
      description: "🤖 Aquí puedes encontrar todos los comandos disponibles.\n\n**¡Elige una categoría a continuación para explorar!**",
      withResponse: false,
      components: buttonRows,
    });

    const collector = message.createMessageComponentCollector({ time: 120000 });

    collector.on("collect", async (buttonInteraction) => {
      const index = parseInt(buttonInteraction.customId.split("_")[1]);

      if (index >= 0 && index < categoryEmbeds.length) {
        await buttonInteraction.update({
          embeds: [categoryEmbeds[index]],
          components: buttonRows,
        });
      }
    });

    collector.on("end", () => {
      return interaction.editReply({ components: [] });
    });
  },
};
