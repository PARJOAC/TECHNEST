const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

async function createButton(buttons) {
    if (!Array.isArray(buttons) || buttons.length === 0) {
        throw new Error("Debes proporcionar al menos un botón en formato de array.");
    }

    const actionRows = [];
    let currentRow = new ActionRowBuilder();

    for (let i = 0; i < buttons.length; i++) {
        const { id, label, style, disabled } = buttons[i];

        // Validación: asegurar que id y label existen, y que style es válido
        if (!id || !label || !style) continue;

        const buttonStyle = {
            primary: ButtonStyle.Primary,
            secondary: ButtonStyle.Secondary,
            danger: ButtonStyle.Danger,
            success: ButtonStyle.Success,
            link: ButtonStyle.Link
        }[style.toLowerCase()] || ButtonStyle.Primary;

        // Verificar si el botón debe estar deshabilitado
        const isDisabled = disabled || false;

        // Crear y añadir el botón
        const button = new ButtonBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(buttonStyle)
            .setDisabled(isDisabled);

        currentRow.addComponents(button);

        // Si la fila tiene 5 botones, crear una nueva
        if (currentRow.components.length === 5 || i === buttons.length - 1) {
            actionRows.push(currentRow);
            if (i !== buttons.length - 1) {
                currentRow = new ActionRowBuilder();
            }
        }
    }

    // Si no se creó ninguna fila válida, agregar un botón de error
    if (actionRows.length === 0) {
        actionRows.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("placeholder")
                    .setLabel("⚠️ Error")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
        );
    }

    return actionRows;
}

module.exports = { createButton };
