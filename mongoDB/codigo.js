const mongoose = require('mongoose');

const Codigo = new mongoose.Schema({
  code: { type: Number }
});

module.exports = mongoose.model('Codigo', Codigo);