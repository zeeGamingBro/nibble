const Eris = require("eris")
const MessageEmbed = require("davie-eris-embed")

/**
 * 
 * @param {Eris.Client} client 
 * @param {Eris.Message} message 
 */
module.exports = {
    async handle(client, message) {
        const prefix = client.config.prefix
        if (message.author.bot) return;
        if (message.channel.type == undefined) return; // what?
    
        if (message.content.includes("nibble") && (Math.random() > 0.8)) await message.channel.createMessage("hai :3")
    
        if (!message.content.startsWith(prefix)) return;
        let args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        if (command.disabled) return;
    
        if (command.args && !args.length) {
            return message.channel.sendEmbed((new MessageEmbed())
                .setColor("#aa6666")
                .setTitle("This command requires arguments.")
                .addField("Proper usage: ", `${prefix}${commandName} ${command.usage}`)
            )
        }
    
        if (command.ownerOnly) {}
    
        try {
            await command.execute(client, message, args)
        } catch (error) {
            message.channel.sendEmbed((new MessageEmbed())
                .setColor("#aa6666")
                .setTitle("An error occurred running this command")
                .setDescription(error.toString())
            )
            console.error(error)
        }
    }
}