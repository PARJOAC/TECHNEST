const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");
const Sanction = require("../../../mongoDB/Sanction");
const { registrarSancion } = require("../../functions/registrarSancion");

const errorEmbed = (title, description) =>
    new EmbedBuilder().setColor("Red").setTitle(title).setDescription(description).setTimestamp();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("desaislar")
        .setDescription("Quita el aislamiento (timeout) a un usuario")
        .addUserOption(opt =>
            opt.setName("usuario").setDescription("Usuario a desaislar").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("razon").setDescription("Motivo del desaislamiento").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const user = interaction.options.getUser("usuario");
        const reason = interaction.options.getString("razon") || "No se indicó motivo.";
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.editReply({
                embeds: [errorEmbed("❌ Usuario no encontrado", "No se encontró al usuario en el servidor.")],
                ephemeral: true,
            });
        }

        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.editReply({
                embeds: [errorEmbed("🚫 Permisos insuficientes", "No tengo permisos para quitar el aislamiento a miembros.")],
                ephemeral: true,
            });
        }

        if (member.roles.highest.position >= bot.roles.highest.position) {
            return interaction.editReply({
                embeds: [errorEmbed("⚠️ Jerarquía inválida", "No puedo desaislar a este usuario porque su rol es igual o superior al mío.")],
                ephemeral: true,
            });
        }

        const stillTimedOut = member.communicationDisabledUntil?.getTime() > Date.now();
        if (!stillTimedOut) {
            return interaction.editReply({
                embeds: [errorEmbed("ℹ️ Sin aislamiento activo", "El usuario no está actualmente aislado.")],
                ephemeral: true,
            });
        }

        try {
            await member.timeout(null, reason);

            await Sanction.findOneAndUpdate(
                { guildId: interaction.guild.id, userId: user.id },
                {
                    $push: {
                        sanctions: {
                            type: "desaislar",
                            reason,
                            moderatorId: interaction.user.id,
                        },
                    },
                },
                { upsert: true }
            );

            await registrarSancion({
                guild: interaction.guild,
                usuarioObjetivo: user,
                moderador: interaction.user,
                tipo: "desaislar",
                razon: reason,
            });

            const successEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🔓 Usuario desaislado")
                .setDescription(`**${user.tag}** ha sido desaislado correctamente.`)
                .addFields({ name: "📝 Motivo", value: reason })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (err) {
            await interaction.editReply({
                embeds: [errorEmbed("❌ Error", "No se pudo desaislar al usuario. Verifica permisos y jerarquía.")],
                ephemeral: true,
            });
        }
    },
};
