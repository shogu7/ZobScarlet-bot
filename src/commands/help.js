const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.js');

module.exports = {
    name: 'help',
    description: 'Affiche toutes les commandes disponibles',
    example: '!help',
    aliases: ['h', '?'],
    execute: async (message) => {

        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'help.js');

        const embed = new EmbedBuilder()
            .setColor('#2C3E50')
            .setTitle('📝 Liste des commandes disponibles :');

        let descriptionText = '';

        for (const file of commandFiles) {
            const command = require(`${commandsPath}/${file}`);
            const name = command.name ? `\`${command.name}\`` : '`Unknown command`';
            const description = command.description || 'Pas de description disponible.';
            const aliases = command.aliases?.length ? command.aliases.join(', ') : 'Pas d\'alias';
            const example = command.example || '';

            descriptionText += `**${name}**\n**Description :** *${description}*\n**Alias :** ${aliases}\n**Exemple :** ${example}\n\n`;
        }

        embed.setDescription(descriptionText.trim())
            .setFooter({ text: '📅 ZobScarlet Bot - Liste des commandes' })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
};
