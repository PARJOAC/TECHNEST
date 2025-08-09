// utils/leveling.js
const Level = require("../../mongoDB/Level");

// Configuración básica del sistema
const COOLDOWN_MS = 10 * 1000; // 6 segundos entre mensajes que dan XP
const XP_MIN = 2;            // XP mínima por mensaje válido
const XP_MAX = 7;            // XP máxima por mensaje válido

/**
 * XP total requerida para ALCANZAR el nivel `nivel` (umbral acumulado).
 * Modelo: cada nivel pide un poco más que el anterior.
 *
 * base: XP para subir de 0→1
 * inc:  aumento adicional por cada nivel siguiente
 *
 * Ejemplo con base=50 e inc=50:
 * 0→1: 50   | total nivel 1 = 50
 * 1→2: 100  | total nivel 2 = 150
 * 2→3: 150  | total nivel 3 = 300
 * 3→4: 200  | total nivel 4 = 500
 */
function xpRequeridaPara(nivel) {
    if (nivel <= 0) return 0; // nivel 0 empieza en 0 XP
    const base = 50; // XP para 0→1
    const inc  = 100; // “extra” por cada nivel adicional
    return base * nivel + (inc * (nivel - 1) * nivel) / 2;
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
    return Level.find({ guildId })
        .sort({ xp: -1, updatedAt: 1 })
        .limit(limite)
        .lean();
}

module.exports = {
    sumarXp,
    obtenerNivel,
    obtenerTop,
    xpRequeridaPara,
    nivelDesdeXp
};
