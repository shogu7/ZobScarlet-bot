const { EmbedBuilder } = require('discord.js');
const config = require('../config.js');

const colors = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x3498db,
    yellow: 0xffff00,
    purple: 0x9b59b6,
    orange: 0xe67e22,
    default: 0x1abc9c
};

module.exports = {
    name: 'zobannonce',
    description: 'Poste une annonce à partir du message reply',
    example: '!za <color> <role a ping>',
    aliases: ['za'],
    execute: async (message, args) => {
        if (!message.channel || !message.guild) return;

        if (message.channel.id !== config.officerChannelId) return;

        if (!message.reference || !message.reference.messageId) {
            message.reply("You must reply to the message you want to announce.");
            return;
        }

        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

        if (!repliedMessage.member.roles.cache.has(config.officerRoleId)) {
            message.reply("You can't announce this message.");
            return;
        }

        const colorArg = args[0]?.toLowerCase() || 'default';
        const embedColor = colors[colorArg] || colors.default;

        const mentionArg = args.slice(1).join(' ') || '';

        const embed = new EmbedBuilder()
            .setTitle('⚔️ Nouvelle annonce')
            .setDescription(repliedMessage.content)
            .setColor(embedColor)
            .setTimestamp()
            .setThumbnail('https://i.postimg.cc/mZpSgkr3/ABS2GSng-Rai6a-Olyw-Go-E6XKm92Ii2Vo6jpbx7VUTei-V1Tyb-K-fm-QTkcs-KO9vb-AQ8-RICe-E2q076ygq-Pt4TYb-Zltl.png')
            .setFooter({
                text: `Posté par ${repliedMessage.author.tag}`,
                iconURL: repliedMessage.author.displayAvatarURL({ dynamic: true })
            });


        const announcementChannel = message.client.channels.cache.get(config.announceChannelId);
        if (!announcementChannel) return console.error("Announcement channel not found.");

        await announcementChannel.send({ content: mentionArg, embeds: [embed] });
        message.reply("Announcement sent!");
    }
};
