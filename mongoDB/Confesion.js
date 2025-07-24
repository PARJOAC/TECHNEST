const mongoose = require("mongoose");

const ConfessionSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  channel: { type: String, default: null },
  dmStatus: { type: Boolean, default: true },
  status: { type: Boolean, default: false },
  last: { type: Number, default: 0 },
  users: [
    {
      authorId: { type: String, required: true },
      confessions: [
        {
          id: { type: String, required: true },
          message: { type: String, required: true },
          date: { type: Date, default: Date.now },
          anonymous: { type: Boolean, default: false },
          messageId: { type: String, required: true },
        },
      ],
      answers: [
        {
          id: { type: String, required: true },
          responseTo: { type: String, required: true },
          message: { type: String, required: true },
          date: { type: Date, default: Date.now },
          anonymous: { type: Boolean, default: false },
          messageId: { type: String, required: false },
        },
      ],
    },
  ],
});

const Confession = mongoose.model("Confession", ConfessionSchema);
module.exports = Confession;
