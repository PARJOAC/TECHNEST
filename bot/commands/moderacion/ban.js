const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Sanction = require("../../../mongoDB/Sanction");
const { registrarSancion } = require("../../functions/registrarSancion");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Banea a un usuario del servidor")
        .addUserOption(opt =>
            opt.setName("usuario").setDescription("Usuario a banear").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("razon").setDescription("Razón del baneo").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const user = interaction.options.getUser("usuario");
        const reason = interaction.options.getString("razon") || "No se indicó motivo.";
        const member = interaction.guild.members.cache.get(user.id);

        const embedError = (title, description) => new EmbedBuilder()
            .setColor("Red")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        if (!member) {
            return interaction.editReply({
                embeds: [embedError("❌ Usuario no encontrado", "El usuario no se encuentra en el servidor.")],
                ephemeral: true
            });
        }

        const ejecutor = interaction.member;
        const bot = interaction.guild.members.me;

        // Verifica si se puede banear al usuario
        if (!member.bannable) {
            return interaction.editReply({
                embeds: [embedError("⛔ Acción no permitida", "No puedo banear a este usuario. Puede que tenga un rol más alto que el mío o que me falten permisos.")],
                ephemeral: true
            });
        }

        if (member.roles.highest.position >= ejecutor.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.editReply({
                embeds: [embedError("⚠️ Rol demasiado alto", "No puedes banear a un usuario con un rol igual o superior al tuyo.")],
                ephemeral: true
            });
        }

        if (member.roles.highest.position >= bot.roles.highest.position) {
            return interaction.editReply({
                embeds: [embedError("⚠️ Rol superior al del bot", "No puedo banear a este usuario porque su rol es igual o superior al mío.")],
                ephemeral: true
            });
        }

        try {
            await member.ban({ reason });

            await Sanction.findOneAndUpdate(
                { guildId: interaction.guild.id, userId: user.id },
                {
                    $push: {
                        sanctions: {
                            type: "ban",
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
                tipo: "ban",
                razon: reason,
            });

            const embed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle("🔨 Usuario baneado")
                .setDescription(`**${user.tag}** ha sido baneado del servidor.`)
                .addFields({ name: "📝 Motivo", value: reason })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            await interaction.editReply({
                embeds: [embedError("❌ Error", "No se pudo banear al usuario. Verifica permisos y jerarquía.")],
                ephemeral: true
            });
        }
    },
};
