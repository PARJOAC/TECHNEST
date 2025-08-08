// commands/top.js
const {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
} = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { obtenerTop, xpRequeridaPara } = require("../../functions/leveling");
const Guild = require("../../../mongoDB/Guild");

/**
 * Dibuja el leaderboard en una sola imagen (top 10).
 * - Avatar circular
 * - Nombre (recortado con "…")
 * - Nivel, XP total y barra al siguiente nivel
 * - Posición (1–10)
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Muestra el top 10 de XP del servidor con una imagen."),

    async execute(interaction) {
        const cfg = await Guild.findOne({ guildId: interaction.guild.id });
        if (cfg?.levelEnabled === false) {
            return interaction.editReply({ content: "❌ El sistema de niveles está desactivado en este servidor.", ephemeral: true });
        }

        const rows = await obtenerTop(interaction.guild.id, 10);
        if (!rows.length) {
            return interaction.editReply("Aún no hay datos de niveles en este servidor.");
        }

        // Construye la imagen
        const buffer = await construirLeaderboard(interaction, rows);
        const file = new AttachmentBuilder(buffer, { name: "leaderboard.png" });

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Top ${rows.length} — ${interaction.guild.name}`)
            .setColor(0xf1c40f)
            .setImage("attachment://leaderboard.png")
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [file] });
    }
};

async function construirLeaderboard(interaction, rows) {
    const ancho = 1000;
    const headerH = 120;
    const filaH = 96;
    const alto = headerH + filaH * rows.length;

    const canvas = createCanvas(ancho, alto);
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#15171b";
    ctx.fillRect(0, 0, ancho, alto);

    // Header
    ctx.fillStyle = "#1f2228";
    roundRect(ctx, 20, 20, ancho - 40, headerH - 40, 20, true);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    const titulo = `Leaderboard — ${interaction.guild.name}`;
    drawText(ctx, titulo, 40, 70, ancho - 80);

    // Filas
    for (let i = 0; i < rows.length; i++) {
        const y0 = headerH + i * filaH + 8;
        const y1 = y0 + filaH - 16;

        // Listrado alterno
        ctx.fillStyle = i % 2 === 0 ? "#1b1f26" : "#202530";
        roundRect(ctx, 20, y0, ancho - 40, y1 - y0, 16, true);

        // Posición
        const pos = i + 1;
        ctx.fillStyle = "#ffd166";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`#${pos}`, 40, y0 + 54);

        // Avatar usuario
        const userId = rows[i].userId;
        const user = await resolveUser(interaction, userId);
        const avatarURL = user?.displayAvatarURL?.({ extension: "png", size: 128 }) ||
            `https://cdn.discordapp.com/embed/avatars/0.png`;

        const avX = 120, avY = y0 + 8, avS = filaH - 32;
        const img = await safeLoadImage(avatarURL);
        ctx.save();
        circleClip(ctx, avX + avS / 2, avY + avS / 2, avS / 2);
        ctx.drawImage(img, avX, avY, avS, avS);
        ctx.restore();

        // Nombre + datos
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px Arial";
        const nombre = user?.username || `Usuario ${userId}`;
        drawText(ctx, nombre, avX + avS + 20, y0 + 36, 420);

        // Nivel y XP
        ctx.font = "20px Arial";
        ctx.fillStyle = "#cfd6de";
        const lvl = rows[i].level;
        const xp = rows[i].xp;
        ctx.fillText(`Nivel ${lvl} — ${xp} XP`, avX + avS + 20, y0 + 66);

        // Barra hacia el siguiente nivel
        const reqCurr = xpRequeridaPara(lvl);
        const reqNext = xpRequeridaPara(lvl + 1);
        const dentro = Math.max(0, xp - reqCurr);
        const need = Math.max(1, reqNext - reqCurr);
        const pct = Math.max(0, Math.min(1, dentro / need));

        const barX = ancho - 420;
        const barY = y0 + 30;
        const barW = 360;
        const barH = 20;

        // Fondo barra
        ctx.fillStyle = "#313846";
        roundRect(ctx, barX, barY, barW, barH, 10, true);

        // Progreso
        ctx.fillStyle = "#00d084";
        roundRect(ctx, barX, barY, Math.max(12, Math.floor(barW * pct)), barH, 10, true);

        // Texto barra
        ctx.fillStyle = "#e5e9ef";
        ctx.font = "18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${dentro}/${need} XP`, barX + barW, barY + barH + 22);
        ctx.textAlign = "left";
    }

    return canvas.toBuffer("image/png");
}

// ==== Helpers Canvas ====
function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    if (fill) ctx.fill();
}

function circleClip(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
}

function drawText(ctx, text, x, y, maxWidth) {
    // Pinta texto y recorta con "…"
    let t = text;
    while (ctx.measureText(t).width > maxWidth && t.length > 0) {
        t = t.slice(0, -1);
    }
    if (t !== text) {
        if (t.length > 0) t = t.slice(0, -1);
        t += "…";
    }
    ctx.fillText(t, x, y);
}

async function resolveUser(interaction, userId) {
    // Intenta miembro del guild; si no, al menos user por ID
    const m = await interaction.guild.members.fetch(userId).catch(() => null);
    if (m?.user) return m.user;
    return await interaction.client.users.fetch(userId).catch(() => null);
}

async function safeLoadImage(url) {
    try {
        return await loadImage(url);
    } catch {
        // Avatar por defecto de Discord (silencioso)
        return await loadImage("https://cdn.discordapp.com/embed/avatars/0.png");
    }
}
