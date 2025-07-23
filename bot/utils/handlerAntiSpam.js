const { EmbedBuilder } = require('discord.js');

const SPAM_LIMIT = 4;
const TIME_WINDOW = 15 * 1000;
const LOG_CHANNEL_ID = process.env.LOG_ANTI_SPAM_CHANNEL_ID;

function getMessageSignature(message) {
    let parts = [];

    if (message.content?.trim()) {
        parts.push(message.content.trim());
    }

    if (message.attachments.size > 0) {
        for (const [, attach] of message.attachments) {
            parts.push(`file:${attach.name}`);
        }
    }

    if (message.stickers.size > 0) {
        for (const [, sticker] of message.stickers) {
            parts.push(`sticker:${sticker.name}`);
        }
    }

    const signature = parts.join('|').slice(0, 300);
    return signature;
}

module.exports = async function handlerAntiSpam(message, spamMap) {
    if (!message.guild || message.author.bot) return;

    const userId = message.author.id;
    const signature = getMessageSignature(message);

    if (!signature || signature.length < 5) return;

    const now = Date.now();
    const key = `${userId}-${signature}`;
    let data = spamMap.get(key);

    if (!data || now - data.timestamp > TIME_WINDOW) {
        data = {
            timestamp: now,
            counts: new Map()
        };
    }

    const prev = data.counts.get(message.channel.id) || 0;
    const newCount = prev + 1;
    data.counts.set(message.channel.id, newCount);
    spamMap.set(key, data);

    const repeatsInThisChannel = newCount;
    const distinctChannels = data.counts.size;

    if (repeatsInThisChannel >= SPAM_LIMIT || distinctChannels >= SPAM_LIMIT) {
        try {
            const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);

            if (logChannel?.isTextBased()) {
                const embed = new EmbedBuilder()
                    .setTitle('🚨 Usuario baneado por SPAM')
                    .setColor('Red')
                    .addFields(
                        { name: 'Usuario', value: `<@${userId}> (${userId})`, inline: true },
                        { name: 'Canales distintos', value: `${distinctChannels}`, inline: true },
                        { name: 'Contenido detectado', value: `\`${signature.slice(0, 100)}...\`` }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

            await message.guild.members.ban(userId, {
                reason: `Spam detectado: contenido repetido`,
                deleteMessageSeconds: 60 * 5
            });

            spamMap.delete(key);
        } catch (err) {
            console.error(`❌ Error al banear a ${message.author.username}:`, err);
        }
    }
};
