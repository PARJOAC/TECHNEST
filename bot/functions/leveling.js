// utils/leveling.js
const Level = require("../../mongoDB/Level");

// Configuración básica del sistema
const COOLDOWN_MS = 15 * 1000; // 1 minuto entre mensajes que dan XP
const XP_MIN = 15;             // XP mínima por mensaje válido
const XP_MAX = 25;             // XP máxima por mensaje válido

/**
 * XP total requerida para alcanzar el nivel n (curva de progresión).
 * Ajusta esta fórmula a tu gusto.
 */
function xpRequeridaPara(nivel) {
    return 100 * nivel; // ejemplo suave
}

/** Convierte XP total acumulada → nivel entero */
function nivelDesdeXp(xpTotal) {
    let lvl = 0;
    while (xpTotal >= xpRequeridaPara(lvl + 1)) lvl++;
    return lvl;
}

/** Suma XP con cooldown por usuario-servidor */
async function sumarXp(guildId, userId) {
    const ahora = Date.now();

    let doc = await Level.findOne({ guildId, userId });
    if (!doc) doc = await Level.create({ guildId, userId });

    // Anti-spam: respeta el cooldown
    if (doc.lastMsgAt && (ahora - doc.lastMsgAt.getTime()) < COOLDOWN_MS) {
        return { actualizado: false, subioNivel: false, doc };
    }

    const gano = XP_MIN + Math.floor(Math.random() * (XP_MAX - XP_MIN + 1));
    const xpNueva = doc.xp + gano;
    const nivelAnt = doc.level;
    const nivelNuevo = nivelDesdeXp(xpNueva);

    doc.xp = xpNueva;
    doc.level = nivelNuevo;
    doc.lastMsgAt = new Date(ahora);
    await doc.save();

    return {
        actualizado: true,
        subioNivel: nivelNuevo > nivelAnt,
        gano,
        doc
    };
}

/** Obtiene/crea documento de nivel */
async function obtenerNivel(guildId, userId) {
    let doc = await Level.findOne({ guildId, userId });
    if (!doc) doc = await Level.create({ guildId, userId });
    return doc;
}

/** Top por XP de un servidor */
async function obtenerTop(guildId, limite = 10) {
    return Level.find({ guildId }).sort({ xp: -1, updatedAt: 1 }).limit(limite).lean();
}

module.exports = {
    sumarXp,
    obtenerNivel,
    obtenerTop,
    xpRequeridaPara,
    nivelDesdeXp
};
