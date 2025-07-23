const { Events } = require('discord.js');
const handlerAntiSpam = require('../utils/handlerAntiSpam');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        handlerAntiSpam(message);
    }
};
