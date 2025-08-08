const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  language: { type: String, default: "es" },
  vipServer: { type: Boolean, default: false },
  levelChannel: { type: String, default: null },
  levelEnabled: { type: Boolean, default: true }
});

const Guild = mongoose.model("Guild", GuildSchema);
module.exports = Guild;
