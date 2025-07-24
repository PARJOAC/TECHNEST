const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  language: { type: String, default: "en" },
  vipServer: { type: Boolean, default: false },
});

const Guild = mongoose.model("Guild", GuildSchema);
module.exports = Guild;
