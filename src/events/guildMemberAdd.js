const { EmbedBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
    name: 'guildMemberAdd',
    execute: async (member) => {
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('🎉 Bienvenue sur le discord de ZobScarlet !')
            .setDescription(`Salut ${member.user}, nous sommes ravis de t'accueillir !\n\nN'hésite pas à te présenter et à consulter les channels pour les annonces et informations.`)
            .setColor(0x1abc9c)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'ZobScarlet Guild', iconURL: 'https://i.postimg.cc/mZpSgkr3/ABS2GSng-Rai6a-Olyw-Go-E6XKm92Ii2Vo6jpbx7VUTei-V1Tyb-K-fm-QTkcs-KO9vb-AQ8-RICe-E2q076ygq-Pt4TYb-Zltl.png' })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
