const { readdirSync } = require("fs");
const path = require("path");

module.exports = async (client) => {
  const eventosPath = path.join(__dirname, "../bot/events");
  const eventFiles = await readdirSync(eventosPath);

  for (const file of eventFiles) {
    const filePath = path.join(eventosPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`Event service started.`);
};
