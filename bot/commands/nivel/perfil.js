// commands/perfil.js
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const Guild = require("../../../mongoDB/Guild");
const Level = require("../../../mongoDB/Level"); // ← usamos el modelo directo para NO crear si no existe
const { xpRequeridaPara } = require("../../functions/leveling"); // solo la fórmula

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Muestra tu tarjeta de nivel (o la de otro usuario).")
        .addUserOption(o =>
            o.setName("usuario")
                .setDescription("Usuario a consultar")
                .setRequired(false)
        ),

    defer: false,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true }); // respuesta pública; si la quieres privada, { ephemeral: true }
        // Cargar config de la guild
        const cfg = await Guild.findOne({ guildId: interaction.guild.id }).catch(() => null);
        if (cfg?.levelEnabled === false) {
            return interaction.editReply({ content: "❌ El sistema de niveles está desactivado en este servidor.", ephemeral: true });
        }



        const usuario = interaction.options.getUser("usuario") || interaction.user;

        // NO crear si no existe:
        const nivelDoc = await Level.findOne({ guildId: interaction.guild.id, userId: usuario.id });

        if (!nivelDoc) {
            // Nada que mostrar
            return interaction.editReply({ content: "ℹ️ Ese usuario aún no tiene datos de nivel en este servidor." });
        }

        const miembro = await interaction.guild.members.fetch(usuario.id).catch(() => null);

        const buffer = await construirTarjeta(usuario, interaction.guild, nivelDoc);

        const archivo = new AttachmentBuilder(buffer, { name: "perfil.png" });
        const embed = new EmbedBuilder()
            .setTitle(`Perfil de ${usuario.username}`)
            .setDescription(`Nivel por servidor: **${interaction.guild.name}**`)
            .setColor(0x00d084)
            .setImage("attachment://perfil.png")
            .setTimestamp();

        if (miembro?.displayHexColor && miembro.displayHexColor !== "#000000") {
            embed.setColor(parseInt(miembro.displayHexColor.replace("#", ""), 16));
        }

        await interaction.editReply({ embeds: [embed], files: [archivo] });
    }
};

// --- Generación de la imagen con Canvas ---
async function construirTarjeta(user, guild, levelDoc) {
    const w = 900, h = 300;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#17181c";
    ctx.fillRect(0, 0, w, h);

    // Panel
    ctx.fillStyle = "#222429";
    roundRect(ctx, 20, 20, w - 40, h - 40, 24, true);

    // Avatar (seguro)
    const avatarURL = user.displayAvatarURL({ extension: "png", size: 256 });
    const avatarImg = await safeLoadImage(avatarURL);
    const avX = 40, avY = 50, avS = 200;

    ctx.save();
    circleClip(ctx, avX + avS / 2, avY + avS / 2, avS / 2);
    ctx.drawImage(avatarImg, avX, avY, avS, avS);
    ctx.restore();

    // Texto principal
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px Arial";
    ctx.fillText(`${user.username}`, 270, 90);

    ctx.fillStyle = "#b6b6b6";
    ctx.font = "20px Arial";
    ctx.fillText(`Servidor: ${guild.name}`, 270, 120);

    // Datos de progreso
    const level = levelDoc.level || 0;
    const xp = levelDoc.xp || 0;
    const reqNext = xpRequeridaPara(level + 1);
    const reqCurr = xpRequeridaPara(level);
    const xpDentro = Math.max(0, xp - reqCurr);
    const xpNecesaria = Math.max(1, reqNext - reqCurr);
    const pct = Math.max(0, Math.min(1, xpDentro / xpNecesaria));

    // Barra
    const barX = 270, barY = 180, barW = 580, barH = 34;
    ctx.fillStyle = "#2f3340";
    roundRect(ctx, barX, barY, barW, barH, 16, true);

    ctx.fillStyle = "#00d084";
    roundRect(ctx, barX, barY, Math.max(12, Math.floor(barW * pct)), barH, 16, true);

    // Números
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";
    ctx.fillText(`Nivel ${level}`, 270, 160);

    ctx.textAlign = "right";
    ctx.fillStyle = "#d6d6d6";
    ctx.fillText(`${xpDentro}/${xpNecesaria} XP`, barX + barW, barY + barH + 28);
    ctx.textAlign = "left";

    return canvas.toBuffer("image/png");
}

// Helpers Canvas
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

async function safeLoadImage(url) {
    try {
        return await loadImage(url);
    } catch {
        return await loadImage("https://cdn.discordapp.com/embed/avatars/0.png");
    }
}
