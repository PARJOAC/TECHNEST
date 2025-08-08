// models/Level.js
const { Schema, model } = require("mongoose");

/**
 * Documento de niveles por (guildId, userId).
 * Un mismo userId puede tener datos distintos en cada guildId.
 */
const LevelSchema = new Schema({
    guildId: { type: String, index: true, required: true },
    userId: { type: String, index: true, required: true },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    lastMsgAt: { type: Date, default: null }, // para cooldown anti-spam
}, { timestamps: true });

LevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model("Level", LevelSchema);
