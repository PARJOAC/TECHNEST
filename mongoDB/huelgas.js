const mongoose = require('mongoose');

const Huelga = new mongoose.Schema({
  titulo_ult: { type: String }
});

module.exports = mongoose.model('Huelga', Huelga);