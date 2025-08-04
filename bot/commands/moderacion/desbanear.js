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
        .setName("desbanear")
        .setDescription("Desbanea a un usuario por su ID")
        .addStringOption(opt =>
            opt.setName("userid").setDescription("ID del usuario").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("razon").setDescription("Razón del desbaneo").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const userId = interaction.options.getString("userid");
        const reason = interaction.options.getString("razon") || "No se indicó motivo.";

        const bot = interaction.guild.members.me;
        if (!bot.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply({
                embeds: [errorEmbed("🚫 Permisos insuficientes", "No tengo permisos para desbanear usuarios.")],
                ephemeral: true,
            });
        }

        try {
            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return interaction.editReply({
                    embeds: [errorEmbed("⚠️ Usuario no baneado", "El usuario no está baneado o el ID no es válido.")],
                    ephemeral: true,
                });
            }

            await interaction.guild.members.unban(userId, reason);

            await Sanction.findOneAndUpdate(
                { guildId: interaction.guild.id, userId },
                {
                    $push: {
                        sanctions: {
                            type: "desbanear",
                            reason,
                            moderatorId: interaction.user.id,
                        },
                    },
                },
                { upsert: true }
            );

            await registrarSancion({
                guild: interaction.guild,
                usuarioObjetivo: {
                    id: userId,
                    tag: bannedUser.user?.tag || `Usuario desconocido (${userId})`,
                },
                moderador: interaction.user,
                tipo: "desbanear",
                razon: reason,
            });

            const successEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("♻️ Usuario desbaneado")
                .setDescription(`Se ha desbaneado correctamente al usuario con ID \`${userId}\`.`)
                .addFields({ name: "📝 Motivo", value: reason })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (err) {
            await interaction.editReply({
                embeds: [errorEmbed("❌ Error al desbanear", "Asegúrate de que el ID sea correcto y que el usuario esté baneado.")],
                ephemeral: true,
            });
        }
    },
};
