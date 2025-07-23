const fs = require("fs");
const { REST, Routes } = require("discord.js");
const path = require("path");

module.exports = async (client) => {
  const foldersPath = path.join(__dirname, "../bot/commands");
  const commandFolders = fs.readdirSync(foldersPath);
  const commands = [];

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);

    if (fs.lstatSync(commandsPath).isDirectory()) {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            `The command in ${filePath} does not have the "data" or "execute" properties.`
          );
        }
      }
    }
  }

  const rest = new REST().setToken(process.env.BOT_TOKEN);

  try {
    await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
      body: commands,
    });

    console.log(`(/) service started.`);
  } catch (error) {
    console.error(error);
  }
};
