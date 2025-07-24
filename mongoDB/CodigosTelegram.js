const mongoose = require('mongoose');

const CodigosTelegramSchema = new mongoose.Schema({
  codigoNuevo: { type: Number },
  codigoAntiguo: { type: Number }
});

const CodigosTelegram = mongoose.model('CodigosTelegram', CodigosTelegramSchema);
module.exports = CodigosTelegram;