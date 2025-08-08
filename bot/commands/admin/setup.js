// commands/setup.js
const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

// 🔁 Ajusta estas rutas a tus modelos reales
const Guild = require("../../../mongoDB/Guild");      // { guildId, language, vipServer, levelChannel, levelEnabled }
const Confession = require("../../../mongoDB/Confesion"); // { guildId, status, dmStatus, channel }

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configura niveles, idioma/VIP y confesiones del servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        // ===== VER =====
        .addSubcommand(sc =>
            sc.setName("ver")
                .setDescription("Muestra la configuración actual.")
        )

        // ===== NIVEL =====
        .addSubcommandGroup(g =>
            g.setName("nivel")
                .setDescription("Opciones del sistema de niveles")
                .addSubcommand(sc =>
                    sc.setName("canal")
                        .setDescription("Establece el canal para avisos de subida de nivel")
                        .addChannelOption(opt =>
                            opt.setName("canal")
                                .setDescription("Canal de texto")
                                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                                .setRequired(true)
                        )
                )
                .addSubcommand(sc =>
                    sc.setName("desactivar")
                        .setDescription("Desactiva los avisos de subida de nivel")
                )
                .addSubcommand(sc =>
                    sc.setName("status")
                        .setDescription("Activa o desactiva el sistema de niveles")
                        .addBooleanOption(o =>
                            o.setName("valor")
                                .setDescription("true = activar, false = desactivar")
                                .setRequired(true)
                        )
                )
        )

        // ===== CONFESIÓN =====
        .addSubcommandGroup(g =>
            g.setName("confesion")
                .setDescription("Opciones del sistema de confesiones")
                .addSubcommand(sc =>
                    sc.setName("status")
                        .setDescription("Activa o desactiva confesiones")
                        .addBooleanOption(o =>
                            o.setName("valor")
                                .setDescription("true = activar, false = desactivar")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sc =>
                    sc.setName("dm_autor")
                        .setDescription("DM al autor cuando respondan a su confesión")
                        .addBooleanOption(o =>
                            o.setName("valor")
                                .setDescription("true/false")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sc =>
                    sc.setName("canal")
                        .setDescription("Canal donde se enviarán las confesiones")
                        .addChannelOption(o =>
                            o.setName("canal")
                                .setDescription("Canal de texto")
                                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                                .setRequired(true)
                        )
                )
        ),

    /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
    category: "confession",
    commandId: "1354425696231096391",
    admin: true,
    defer: false,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Upsert de Guild config
        let guildCfg = await Guild.findOne({ guildId: interaction.guild.id }).catch(() => null);
        if (!guildCfg) {
            try {
                guildCfg = await Guild.create({ guildId: interaction.guild.id });
            } catch (e) {
                console.error("Error creando Guild config:", e);
                return interaction.editReply("❌ Error creando configuración del servidor.");
            }
        }

        const sub = interaction.options.getSubcommand(false);
        const group = interaction.options.getSubcommandGroup(false);

        // ===== /setup ver =====
        if (!group && sub === "ver") {
            const confCfg = await Confession.findOne({ guildId: interaction.guild.id }).catch(() => null);

            const embed = new EmbedBuilder()
                .setTitle("⚙️ Configuración del servidor")
                .setColor(0x2ecc71)
                .addFields(
                    {
                        name: "Sistema de niveles",
                        value: guildCfg.levelEnabled === false ? "Desactivado ❌" : "Activado ✅",
                        inline: true
                    },
                    {
                        name: "Canal niveles",
                        value: guildCfg.levelChannel ? `<#${guildCfg.levelChannel}>` : "No configurado",
                        inline: true
                    },
                    {
                        name: "Idioma",
                        value: `\`${guildCfg.language || "en"}\``,
                        inline: true
                    },
                    {
                        name: "VIP",
                        value: guildCfg.vipServer ? "Activado ✅" : "Desactivado ❌",
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: "Confesiones: estado",
                        value: confCfg?.status ? "Activado ✅" : "Desactivado ❌",
                        inline: true
                    },
                    {
                        name: "Confesiones: DM autor",
                        value: confCfg?.dmStatus ? "Activado ✅" : "Desactivado ❌",
                        inline: true
                    },
                    {
                        name: "Confesiones: canal",
                        value: confCfg?.channel ? `<#${confCfg.channel}>` : "No configurado",
                        inline: true
                    },
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        // ===== NIVEL =====
        if (group === "nivel") {
            // /setup nivel canal
            if (sub === "canal") {
                const canal = interaction.options.getChannel("canal", true);
                const perms = canal.permissionsFor(interaction.client.user);
                if (!perms?.has(PermissionFlagsBits.SendMessages)) {
                    return interaction.editReply(`No tengo permisos para **enviar mensajes** en ${canal}.`);
                }
                guildCfg.levelChannel = canal.id;
                await guildCfg.save().catch(() => null);
                return interaction.editReply(`✅ Canal de avisos de **subida de nivel** establecido en ${canal}.`);
            }

            // /setup nivel desactivar  (solo borra el canal de avisos)
            if (sub === "desactivar") {
                guildCfg.levelChannel = null;
                await guildCfg.save().catch(() => null);
                return interaction.editReply("✅ Avisos de **subida de nivel** desactivados (canal borrado).");
            }

            // /setup nivel status valor:true/false  (activa/desactiva TODO el sistema de niveles)
            if (sub === "status") {
                const valor = interaction.options.getBoolean("valor", true);
                guildCfg.levelEnabled = !!valor;
                await guildCfg.save().catch(() => null);
                return interaction.editReply(`✅ Sistema de niveles **${valor ? "activado" : "desactivado"}**.`);
            }
        }

        // ===== CONFESIONES =====
        if (group === "confesion") {
            // Upsert Confession por guild
            let confCfg = await Confession.findOne({ guildId: interaction.guild.id }).catch(() => null);
            if (!confCfg) {
                try {
                    confCfg = await Confession.create({ guildId: interaction.guild.id });
                } catch (e) {
                    console.error("Error creando Confession config:", e);
                    return interaction.editReply("❌ Error creando configuración de confesiones.");
                }
            }

            // /setup confesion status valor:true/false
            if (sub === "status") {
                const valor = interaction.options.getBoolean("valor", true);
                confCfg.status = valor;
                await confCfg.save().catch(() => null);
                return interaction.editReply(`✅ Sistema de confesiones **${valor ? "activado" : "desactivado"}**.`);
            }

            // /setup confesion dm_autor valor:true/false
            if (sub === "dm_autor") {
                const valor = interaction.options.getBoolean("valor", true);
                confCfg.dmStatus = valor;
                await confCfg.save().catch(() => null);
                return interaction.editReply(`✅ DM al autor **${valor ? "activado" : "desactivado"}**.`);
            }

            // /setup confesion canal #canal
            if (sub === "canal") {
                const canal = interaction.options.getChannel("canal", true);
                const perms = canal.permissionsFor(interaction.client.user);
                if (!perms?.has(PermissionFlagsBits.SendMessages)) {
                    return interaction.editReply(`No tengo permisos para **enviar mensajes** en ${canal}.`);
                }
                confCfg.channel = canal.id;
                await confCfg.save().catch(() => null);
                return interaction.editReply(`✅ Canal de **confesiones** establecido en ${canal}.`);
            }
        }

        return interaction.editReply("No se reconoció la opción.");
    },
};
