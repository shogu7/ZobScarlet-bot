const { EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const PUBLIC_CHANNEL_ID = '1441034871618146445';
const ADMIN_CHANNEL_ID = '1441036535112929320';
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'gvgChoices.json');
const STATE_FILE = path.join(DATA_DIR, 'gvgState.json');

const EMOJIS = { siege: '⚔️', gvg: '🌍', none: '❌' };
const EMOJI_ALL = '✨';

let memberChoices = {};
let state = { lastPollMessageId: null, lastAdminMessageId: null };

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (fs.existsSync(DATA_FILE)) memberChoices = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || {};
if (fs.existsSync(STATE_FILE)) state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) || state;

function saveChoices() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memberChoices, null, 2), 'utf8');
}

function saveState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function buildAdminEmbed() {
    const siegeList = [];
    const gvgList = [];
    const allList = [];
    const noneList = [];

    for (const [userId, entry] of Object.entries(memberChoices)) {
        const choices = entry.choices || [];
        const hasSiege = choices.includes(EMOJIS.siege);
        const hasGvG = choices.includes(EMOJIS.gvg);
        const hasNone = choices.includes(EMOJIS.none);

        if (hasSiege && hasGvG) allList.push(entry.tag);
        else if (hasSiege) siegeList.push(entry.tag);
        else if (hasGvG) gvgList.push(entry.tag);
        else if (hasNone) noneList.push(entry.tag);
    }

    let desc = '';
    desc += `**${EMOJI_ALL} Les deux (${allList.length})**\n${allList.length ? allList.map(t => `• ${t}`).join('\n') : 'Aucun'}\n\n`;
    desc += `**${EMOJIS.siege} Siège (${siegeList.length})**\n${siegeList.length ? siegeList.map(t => `• ${t}`).join('\n') : 'Aucun'}\n\n`;
    desc += `**${EMOJIS.gvg} GvG World (${gvgList.length})**\n${gvgList.length ? gvgList.map(t => `• ${t}`).join('\n') : 'Aucun'}\n\n`;
    desc += `**${EMOJIS.none} Aucun (${noneList.length})**\n${noneList.length ? noneList.map(t => `• ${t}`).join('\n') : 'Aucun'}`;

    return new EmbedBuilder()
        .setTitle('📋 Inscription GvG - Résumé')
        .setDescription(desc)
        .setColor(0xe67e22)
        .setTimestamp();
}

async function expireOldPoll(publicChannel, adminChannel) {
    // Expire old public poll
    if (state.lastPollMessageId) {
        try {
            const oldMessage = await publicChannel.messages.fetch(state.lastPollMessageId).catch(() => null);
            if (oldMessage) {
                const oldEmbed = oldMessage.embeds && oldMessage.embeds[0] ? EmbedBuilder.from(oldMessage.embeds[0]) : new EmbedBuilder().setTitle('📋 Inscription GvG / Siege Battle');
                const expiredEmbed = EmbedBuilder.from(oldEmbed)
                    .setTitle('📋 Inscription GvG / Siege Battle (Expiré)')
                    .setColor(0x95a5a6)
                    .setDescription('Ce sondage est maintenant clos.');

                await oldMessage.edit({ embeds: [expiredEmbed] }).catch(console.error);
                await oldMessage.reactions.removeAll().catch(console.error);
            }
        } catch (err) {
            console.error('Impossible de récupérer/modifier l’ancien sondage :', err);
        }
    }

    // Expire old admin summary
    if (state.lastAdminMessageId) {
        try {
            const oldAdminMsg = await adminChannel.messages.fetch(state.lastAdminMessageId).catch(() => null);
            if (oldAdminMsg) {
                const oldEmbed = oldAdminMsg.embeds && oldAdminMsg.embeds[0] ? EmbedBuilder.from(oldAdminMsg.embeds[0]) : buildAdminEmbed();
                const expiredAdminEmbed = EmbedBuilder.from(oldEmbed)
                    .setTitle((oldEmbed.data && oldEmbed.data.title ? oldEmbed.data.title : '📋 Inscription GvG - Résumé') + ' (Expiré)')
                    .setColor(0x95a5a6);

                await oldAdminMsg.edit({ embeds: [expiredAdminEmbed] }).catch(console.error);
            }
        } catch (err) {
            console.error('Impossible de récupérer/modifier l’ancien admin message :', err);
        }
    }

    // clear stored state (we'll overwrite after creating new poll)
    state.lastPollMessageId = null;
    state.lastAdminMessageId = null;
    saveState();
}

async function sendGvGPoll(client) {
    const publicChannel = await client.channels.fetch(PUBLIC_CHANNEL_ID).catch(() => null);
    const adminChannel = await client.channels.fetch(ADMIN_CHANNEL_ID).catch(() => null);
    if (!publicChannel || !adminChannel) return console.error('Channels non trouvés');

    // Expire previous poll/admin message first
    await expireOldPoll(publicChannel, adminChannel);

    // Réinitialisation des choix
    memberChoices = {};
    saveChoices();

    const pollEmbed = new EmbedBuilder()
        .setTitle('📋 Inscription GvG / Siege Battle')
        .setDescription(`Réagissez pour vous inscrire :\n\n${EMOJIS.siege} Siege Battle\n${EMOJIS.gvg} GvG World\n${EMOJIS.none} Aucun`)
        .setColor(0x1abc9c)
        .setTimestamp();

    const pollMessage = await publicChannel.send({
        content: '<@&1440976122014863370>',
        embeds: [pollEmbed],
        allowedMentions: { roles: ['1440976122014863370'] }
    });

    for (const emoji of Object.values(EMOJIS)) {
        await pollMessage.react(emoji).catch(console.error);
    }

    const adminMessage = await adminChannel.send({ embeds: [buildAdminEmbed()] });

    // Store new poll/admin IDs in state
    state.lastPollMessageId = pollMessage.id;
    state.lastAdminMessageId = adminMessage.id;
    saveState();

    const filter = (reaction, user) => !user.bot && Object.values(EMOJIS).includes(reaction.emoji.name);
    const collector = pollMessage.createReactionCollector({ filter, dispose: true });

    collector.on('collect', async (reaction, user) => {
        try {
            if (reaction.partial) await reaction.fetch();
            if (!memberChoices[user.id]) memberChoices[user.id] = { tag: user.tag, choices: [] };
            const emojiName = reaction.emoji.name;

            if (emojiName === EMOJIS.none) memberChoices[user.id].choices = [EMOJIS.none];
            else {
                memberChoices[user.id].choices = memberChoices[user.id].choices.filter(e => e !== EMOJIS.none);
                if (!memberChoices[user.id].choices.includes(emojiName)) memberChoices[user.id].choices.push(emojiName);
            }

            saveChoices();
            await adminMessage.edit({ embeds: [buildAdminEmbed()] }).catch(console.error);
        } catch (err) {
            console.error('Erreur on collect:', err);
        }
    });

    collector.on('remove', async (reaction, user) => {
        try {
            if (reaction.partial) await reaction.fetch();
            const entry = memberChoices[user.id];
            if (!entry) return;
            entry.choices = entry.choices.filter(e => e !== reaction.emoji.name);
            if (!entry.choices.length) delete memberChoices[user.id];

            saveChoices();
            await adminMessage.edit({ embeds: [buildAdminEmbed()] }).catch(console.error);
        } catch (err) {
            console.error('Erreur on remove:', err);
        }
    });
}

// EXPORT test command
module.exports = { sendGvGPoll };

// SCHEDULER samedi 00:00
module.exports.scheduleGvGPoll = (client) => {
    cron.schedule('0 0 * * 6', async () => {
        await sendGvGPoll(client);
    }, { timezone: 'Europe/Paris' });
};
