const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'zobclear',
    description: 'Supprime un certain nombre de messages dans le channel ou tout le channel.',
    aliases: ['zclear', 'zc'],
    example: '!zclear 10',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ Tu n'as pas la permission de gérer les messages.");
        }

        if (!args[0]) {
            return message.reply("Usage : `!zclear <nombre|all>` (ex: 10 ou all)");
        }

        const deleteCount = args[0].toLowerCase() === 'all' ? null : parseInt(args[0]);

        try {
            if (deleteCount === null) {
                const fetched = await message.channel.messages.fetch({ limit: 100 });
                await message.channel.bulkDelete(fetched, true);
                message.channel.send(`✅ Les 100 derniers messages ont été supprimés.`)
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            } else if (!isNaN(deleteCount) && deleteCount > 0) {
                const toDelete = Math.min(deleteCount, 100);
                await message.channel.bulkDelete(toDelete, true);
                message.channel.send(`✅ ${toDelete} message(s) supprimé(s).`)
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            } else {
                message.reply("❌ Nombre invalide.");
            }
        } catch (err) {
            console.error(err);
            message.reply("❌ Impossible de supprimer les messages.");
        }
    }
};
