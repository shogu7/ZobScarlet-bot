const { sendGvGPoll } = require('../tasks/gvgPoll');

module.exports = {
  name: 'gvgtest',
  description: 'Test GvG poll maintenant',
  aliases: ['zgvgt'],
  execute: async (message) => {
    await sendGvGPoll(message.client);
    message.reply('✅ GvG poll déclenché pour test !');
  }
};
