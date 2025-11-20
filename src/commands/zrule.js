const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'zrule',
    description: 'Affiche les règles GvG, Siège et Laby',
    example: '!zrule',
    aliases: ['rule', 'regle', 'rules'],
    execute: async (message) => {

        const embed = new EmbedBuilder()
            .setColor('#2C3E50')
            .setTitle('📜 RÈGLES')
            .setDescription(`

**Laby :**
• Minimum **3 attaques**
• Quand **Tartaross** est découvert → le taper **chaque jour**

**Siège :**
• Si tu es inscrit → **minimum 5 attaques**

**GvG :**
• ❌ Ne pas taper les **bases vertes**

**GvG World :**
• ❌ Ne pas taper les **bases vertes**

**Absence :**
• Absences **tolérées si elles sont justifiées** (week-end, vacances, imprévu, etc.)
• Pas de kick si l’absence est **signalée à l’avance ou expliquée**
            `)
            .setFooter({ text: '📅 ZobScarlet Bot - Règles' })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
};
