module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        if (!message.guild || !message.content) return;

        const prefix = '!';
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // parse command
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = message.client.commands.get(commandName)
            || [...message.client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return; 

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There was an error executing that command.");
        }
    }
};
