const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
const Sanction = require("../../../mongoDB/Sanction");

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Muestra el historial de sanciones de un usuario")
        .addUserOption(opt =>
            opt.setName("usuario").setDescription("Usuario objetivo").setRequired(true)
        ),
    category: "moderacion",
    commandId: "1296240894306943039",
    async execute(interaction) {
        const user = interaction.options.getUser("usuario");
        const record = await Sanction.findOne({
            guildId: interaction.guild.id,
            userId: user.id,
        });

        if (!record || record.sanctions.length === 0) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("✅ Sin sanciones registradas")
                        .setDescription(`El usuario **${user.tag}** no tiene sanciones registradas en este servidor.`)
                ],
                ephemeral: true,
            });
        }

        const sorted = record.sanctions
            .slice()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const pageSize = 5;
        let page = 0;
        const totalPages = Math.ceil(sorted.length / pageSize);

        const getEmbed = (page) => {
            const start = page * pageSize;
            const end = start + pageSize;
            const sanciones = sorted.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle(`📊 Historial de sanciones de ${user.tag}`)
                .setColor("DarkRed")
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: `Página ${page + 1} de ${totalPages}` })
                .setTimestamp();

            sanciones.forEach((s, i) => {
                embed.addFields({
                    name: `#${start + i + 1} - ${s.type.toUpperCase()}`,
                    value:
                        `📝 **Motivo:** ${s.reason}\n` +
                        `👮‍♂️ **Moderador:** <@${s.moderatorId}>\n` +
                        `🕒 <t:${Math.floor(new Date(s.timestamp).getTime() / 1000)}:f>` +
                        (s.duration ? `\n⏱️ **Duración:** ${formatDuration(s.duration)}` : ""),
                });
            });

            return embed;
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("anterior")
                .setLabel("⏮️ Anterior")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("siguiente")
                .setLabel("⏭️ Siguiente")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(totalPages <= 1)
        );

        const msg = await interaction.editReply({
            embeds: [getEmbed(page)],
            components: [row],
            ephemeral: true,
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on("collect", async (btn) => {
            if (btn.user.id !== interaction.user.id)
                return btn.reply({ content: "❌ Este botón no es para ti.", ephemeral: true });

            if (btn.customId === "anterior" && page > 0) page--;
            else if (btn.customId === "siguiente" && page < totalPages - 1) page++;

            row.components[0].setDisabled(page === 0);
            row.components[1].setDisabled(page === totalPages - 1);

            await btn.update({ embeds: [getEmbed(page)], components: [row] });
        });

        collector.on("end", async () => {
            const disabledRow = new ActionRowBuilder().addComponents(
                row.components.map((btn) => ButtonBuilder.from(btn).setDisabled(true))
            );
            await msg.edit({ components: [disabledRow] }).catch(() => { });
        });
    },
};
