const mongoose = require("mongoose");

const sanctionSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    sanctions: [
        {
            type: {
                type: String,
                enum: ["ban", "expulsion", "aislar", "desaislar", "desbanear"],
                required: true,
            },
            reason: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            moderatorId: { type: String, required: true },
            duration: Number, // en milisegundos, solo para aislar
        },
    ],
});

module.exports = mongoose.model("Sanction", sanctionSchema);
