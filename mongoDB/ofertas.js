const mongoose = require('mongoose');

const Oferta = new mongoose.Schema({
  oferta: { type: Number }
});

module.exports = mongoose.model('Oferta', Oferta);