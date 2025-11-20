const { EmbedBuilder } = require('discord.js');

function parseTime(timeString) {
    const match = timeString.match(/^(\d+)([smhd])$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}

module.exports = {
    name: 'zobreminder',
    description: 'Créer un rappel en DM.',
    aliases: ['zrmd'],
    example: '!zobreminder 5h manger une choucroute',
    execute: async (message, args) => {
        if (!args[0] || !args[1]) {
            return message.reply("Usage : `!zobreminder <temps> <message>` (ex: 5h, 30m, 10s)");
        }

        const timeMs = parseTime(args[0]);
        if (!timeMs) return message.reply("Temps invalide. Utilise s/m/h/d (ex: 5h, 30m, 10s).");

        const reminderText = args.slice(1).join(' ');

        message.reply(`✅ Rappel programmé pour **${args[0]}**`);

        setTimeout(async () => {
            try {
                const embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('⏰ Rappel')
                    .setDescription(reminderText)
                    .setTimestamp()
                    .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

                await message.author.send({ embeds: [embed] });
            } catch (err) {
                console.error("Impossible d'envoyer le DM :", err);
                message.channel.send(`${message.author}, je n'ai pas pu t'envoyer le DM.`);
            }
        }, timeMs);
    }
};
