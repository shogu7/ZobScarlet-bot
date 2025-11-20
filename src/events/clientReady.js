const { scheduleGvGPoll } = require('../tasks/gvgPoll');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`${client.user.tag} is online.`);
    scheduleGvGPoll(client);
  }
};
