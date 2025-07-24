const mongoose = require('mongoose');

const HuelgaSchema = new mongoose.Schema({
  tituloUltimaHuelga: { type: String }
});

const Huelgas = mongoose.model('Huelga', HuelgaSchema);
module.exports = Huelgas;