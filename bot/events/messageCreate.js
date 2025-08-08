// events/messageCreate.js
const { Events, PermissionFlagsBits } = require("discord.js");
const antiSpam = require("../functions/antiSpam");
const { sumarXp } = require("../functions/leveling");
const GuildConfig = require("../../mongoDB/Guild");

const spamMap = new Map();
let cleaningStarted = false;

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        try { antiSpam(message, spamMap); } catch { }

        if (!cleaningStarted) {
            cleaningStarted = true;
            const SPAM_TIME_WINDOW = 15 * 1000;
            setInterval(() => {
                const now = Date.now();
                for (const [key, data] of spamMap.entries()) {
                    const timeInactive = now - (data.timestamp || 0);
                    const totalReps = Array.from((data.counts || new Map()).values()).reduce((a, b) => a + b, 0);
                    if (timeInactive > SPAM_TIME_WINDOW * 3 && totalReps <= 1) spamMap.delete(key);
                }
            }, 60 * 1000);
        }

        try {
            if (!message.guild) return;
            if (message.system || message.webhookId || message.author?.bot) return;
            if (!message.content?.trim()) return;

            // 👇 comprobar si niveles está activado
            const cfg = await GuildConfig.findOne({ guildId: message.guild.id });
            const levelsOn = cfg?.levelEnabled !== false; // undefined => true
            if (!levelsOn) return; // Desactivado: ni XP, ni anuncios

            // Sumar XP
            const res = await sumarXp(message.guild.id, message.author.id);
            if (!res?.subioNivel) return;

            // Aviso de nivel (si hay canal configurado)
            if (!cfg?.levelChannel) return;
            let canal = message.guild.channels.cache.get(cfg.levelChannel) || await message.guild.channels.fetch(cfg.levelChannel).catch(() => null);
            if (!canal?.isTextBased?.()) return;

            const me = await message.guild.members.fetchMe();
            const perms = canal.permissionsFor(me);
            if (!perms?.has(PermissionFlagsBits.SendMessages)) return;

            await canal.send({ content: `🎉 <@${message.author.id}> ha subido a **nivel ${res.doc.level}**. ¡Felicidades!` }).catch(() => { });
        } catch (e) {
            console.error("[Leveling] Error en messageCreate:", e);
        }
    }
};
