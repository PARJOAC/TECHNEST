const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");
const Sanction = require("../../../mongoDB/Sanction");
const { registrarSancion } = require("../../functions/registrarSancion");

function parseDuration(input) {
    const match = input.match(/^(\d+)(s|m|h|d|w)$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
}

function formatDuration(ms) {
    const units = [
        { label: "sem", value: 7 * 24 * 60 * 60 * 1000 },
        { label: "d", value: 24 * 60 * 60 * 1000 },
        { label: "h", value: 60 * 60 * 1000 },
        { label: "min", value: 60 * 1000 },
        { label: "s", value: 1000 },
    ];

    let remaining = ms;
    const parts = [];

    for (const unit of units) {
        const amount = Math.floor(remaining / unit.value);
        if (amount > 0) {
            parts.push(`${amount}${unit.label}`);
            remaining -= amount * unit.value;
        }
    }

    return parts.join(" ");
}

const errorEmbed = (title, desc) =>
    new EmbedBuilder().setColor("Red").setTitle(title).setDescription(desc).setTimestamp();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("aislar")
        .setDescription("Aísla (timeout) a un usuario por cierto tiempo")
        .addUserOption(opt =>
            opt.setName("usuario").setDescription("Usuario a aislar").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("duracion").setDescription("Ej: 10s, 5m, 1h, 2d, 1w (máx: 28d)").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("razon").setDescription("Razón del aislamiento").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const user = interaction.options.getUser("usuario");
        const rawDuration = interaction.options.getString("duracion");
        const reason = interaction.options.getString("razon") || "No se indicó motivo.";
        const duration = parseDuration(rawDuration);
        const MAX_TIMEOUT = 28 * 24 * 60 * 60 * 1000;

        if (!duration) {
            return interaction.editReply({
                embeds: [errorEmbed("❌ Duración inválida", "Formato incorrecto. Usa `10s`, `5m`, `1h`, `2d`, `1w`, etc.")]
            });
        }

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.editReply({
                embeds: [errorEmbed("❌ Usuario no encontrado", "No se pudo encontrar al usuario en el servidor.")]
            });
        }

        const ejecutor = interaction.member;
        const bot = interaction.guild.members.me;

        if (!member.moderatable) {
            return interaction.editReply({
                embeds: [errorEmbed("⛔ Acción no permitida", "No puedo aislar a este usuario. Puede que tenga un rol más alto que el mío o que me falten permisos.")],
                ephemeral: true,
            });
        }

        if (member.roles.highest.position >= ejecutor.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.editReply({
                embeds: [errorEmbed("⚠️ Rol demasiado alto", "No puedes aislar a un usuario con un rol igual o superior al tuyo.")],
                ephemeral: true,
            });
        }

        if (member.roles.highest.position >= bot.roles.highest.position) {
            return interaction.editReply({
                embeds: [errorEmbed("⚠️ Rol superior al del bot", "No puedo aislar a este usuario porque su rol es igual o superior al mío.")],
                ephemeral: true,
            });
        }

        const now = Date.now();
        const currentTimeout = member.communicationDisabledUntil?.getTime() || 0;
        const remainingTime = currentTimeout > now ? currentTimeout - now : 0;
        const newTotal = remainingTime + duration;

        if (newTotal > MAX_TIMEOUT) {
            return interaction.editReply({
                embeds: [errorEmbed("⛔ Límite superado", `El aislamiento actual (${formatDuration(remainingTime)} restantes) más los \`${rawDuration}\` superan el límite máximo de 28 días.`)]
            });
        }

        try {
            await member.timeout(newTotal, reason);

            await Sanction.findOneAndUpdate(
                { guildId: interaction.guild.id, userId: user.id },
                {
                    $push: {
                        sanctions: {
                            type: "aislar",
                            reason,
                            moderatorId: interaction.user.id,
                            duration,
                        },
                    },
                },
                { upsert: true }
            );

            await registrarSancion({
                guild: interaction.guild,
                usuarioObjetivo: user,
                moderador: interaction.user,
                tipo: "aislar",
                razon: reason,
                duracion: duration,
            });

            const successEmbed = new EmbedBuilder()
                .setColor("DarkOrange")
                .setTitle("⛓️ Aislamiento aplicado")
                .setDescription(`**${user.tag}** ha sido aislado durante \`${rawDuration}\`.`)
                .addFields(
                    { name: "📝 Motivo", value: reason },
                    { name: "⏱️ Total acumulado", value: formatDuration(newTotal) }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (err) {
            await interaction.editReply({
                embeds: [errorEmbed("❌ Error", "No se pudo aplicar el aislamiento. Verifica permisos y jerarquía.")],
                ephemeral: true,
            });
        }
    },
};
