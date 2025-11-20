const cron = require('node-cron');
const config = require('../config.js');

module.exports = (client) => {
  cron.schedule('0 12 * * 1', () => {
    const channel = client.channels.cache.get(config.announceChannelId);
    if (channel) {
      channel.send("⚔️ Début du **premier tour** des combats d’occupation ! Que la guilde montre sa force !");
      console.log("message send for the first turn")
    }
  });

  cron.schedule('0 12 * * 4', () => {
    const channel = client.channels.cache.get(config.announceChannelId);
    if (channel) {
      channel.send("⚔️ Début du **deuxième tour** des combats d’occupation ! Préparez vos attaques !");
      console.log("message send for the second turn")
    }
  });
};
