const mongoose = require('mongoose');

const OfertaSchema = new mongoose.Schema({
  idOferta: { type: Number }
});

const Ofertas = mongoose.model('Oferta', OfertaSchema);
module.exports = Ofertas;