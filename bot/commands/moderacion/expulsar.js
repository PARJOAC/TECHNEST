const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");
const Sanction = require("../../../mongoDB/Sanction");
const { registrarSancion } = require("../../functions/registrarSancion");

const errorEmbed = (titulo, descripcion) =>
    new EmbedBuilder().setColor("Red").setTitle(titulo).setDescription(descripcion).setTimestamp();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("expulsar")
        .setDescription("Expulsa a un usuario del servidor")
        .addUserOption(opt =>
            opt.setName("usuario").setDescription("Usuario a expulsar").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("razon").setDescription("Razón de la expulsión").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const user = interaction.options.getUser("usuario");
        const reason = interaction.options.getString("razon") || "No se indicó motivo.";
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.editReply({
                embeds: [errorEmbed("❌ Usuario no encontrado", "No se pudo localizar al usuario en el servidor.")],
                ephemeral: true,
            });
        }

        const ejecutor = interaction.member;
        const bot = interaction.guild.members.me;

        if (!member.kickable) {
            return interaction.editReply({
                embeds: [errorEmbed("🚫 Acción no permitida", "No puedo expulsar a este usuario. Puede que tenga un rol más alto o me falten permisos.")],
                ephemeral: true,
            });
        }

        if (
            member.roles.highest.position >= ejecutor.roles.highest.position &&
            interaction.user.id !== interaction.guild.ownerId
        ) {
            return interaction.editReply({
                embeds: [errorEmbed("⚠️ Jerarquía insuficiente", "No puedes expulsar a un usuario con un rol igual o superior al tuyo.")],
                ephemeral: true,
            });
        }

        if (member.roles.highest.position >= bot.roles.highest.position) {
            return interaction.editReply({
                embeds: [errorEmbed("⚠️ Rol superior", "No puedo expulsar a este usuario porque su rol es igual o superior al mío.")],
                ephemeral: true,
            });
        }

        try {
            await member.kick(reason);

            await Sanction.findOneAndUpdate(
                { guildId: interaction.guild.id, userId: user.id },
                {
                    $push: {
                        sanctions: {
                            type: "expulsion",
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
                tipo: "expulsion",
                razon: reason,
            });

            const successEmbed = new EmbedBuilder()
                .setColor("DarkOrange")
                .setTitle("👢 Usuario expulsado")
                .setDescription(`**${user.tag}** ha sido expulsado del servidor.`)
                .addFields({ name: "📝 Motivo", value: reason })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });
        } catch (err) {
            await interaction.editReply({
                embeds: [errorEmbed("❌ Error al expulsar", "No se pudo expulsar al usuario. Verifica permisos y jerarquía.")],
                ephemeral: true,
            });
        }
    },
};
