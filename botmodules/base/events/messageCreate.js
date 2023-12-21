const Eris = require("eris")
const MessageEmbed = require("davie-eris-embed")
const { isModuleEnabled } = require("../../../util/moduleUtil")

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
        let enabled = await isModuleEnabled(message.guildID, command.module)
        if (command.module == "base") enabled = true
        if (!enabled) {
            return message.channel.sendEmbed((new MessageEmbed())
                .setColor("#aa6666")
                .setTitle("This command's module is disabled.")
                .setDescription("Module " + client.modules.get(command.module).name + " is disabled in this server.")    
            )
        }
    
        if (command.args && !args.length) {
            return message.channel.sendEmbed((new MessageEmbed())
                .setColor("#aa6666")
                .setTitle("This command requires arguments.")
                .addField("Proper usage: ", `${prefix}${commandName} ${command.usage}`)
            )
        }

        if (command.permissions?.length > 0) {
            let canExecute = true
    
            if (Array.isArray(command.permissions)) {
                let member = client.guilds.get(message.guildID).members.get(message.author.id)
                console.log(member)
                command.permissions.forEach(permission => {
                    if (!member.permissions.json[permission]) canExecute = false;
                });
            }
    
            if (!canExecute) {
                return message.channel.sendEmbed((new MessageEmbed())
                    .setColor(client.config.embedColors.error)
                    .setTitle("You do not have the proper permissions to run this command.")
                    .setDescription("Required permissions: " + command.permissions)
                )
            }
        }
    
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