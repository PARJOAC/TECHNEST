const mongoose = require('mongoose');

const Codigo_ant = new mongoose.Schema({
  code_ant: { type: Number }
});

module.exports = mongoose.model('Codigo_ant', Codigo_ant);