const { Events } = require('discord.js');
const antiSpam = require('../functions/antiSpam');
const spamMap = new Map();

let cleaningStarted = false;

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        antiSpam(message, spamMap);

        if (!cleaningStarted) {
            cleaningStarted = true;

            const SPAM_TIME_WINDOW = 15 * 1000;

            setInterval(() => {
                const now = Date.now();
                for (const [key, data] of spamMap.entries()) {
                    const timeInactive = now - data.timestamp;
                    const totalReps = Array.from(data.counts.values()).reduce((a, b) => a + b, 0);
                    if (timeInactive > SPAM_TIME_WINDOW * 3 && totalReps <= 1) {
                        spamMap.delete(key);
                    }
                }
            }, 60 * 1000);
        }
    }
};
