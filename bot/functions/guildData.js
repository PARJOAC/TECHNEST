const Confesion = require("../../mongoDB/Confesion");
const Guild = require("../../mongoDB/Guild");

const path = require("path");
const fs = require("fs");

async function getConfessionData(guild) {
  let guildData = await Confesion.findOne({ guildId: guild });

  if (!guildData) {
    guildData = new Confesion({
      guildId: guild,
    });
    await guildData.save();
  }

  return guildData;
}

async function getGuildData(guild) {
  let guildData = await Guild.findOne({ guildId: guild });

  if (!guildData) {
    guildData = new Guild({
      guildId: guild,
    });
    await guildData.save();
  }

  return guildData;
}

module.exports = {
  getConfessionData,
  getGuildData,
};
