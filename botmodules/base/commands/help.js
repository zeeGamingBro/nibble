const MessageEmbed = require("davie-eris-embed")
const { isModuleEnabled } = require("../../../util/moduleUtil")

module.exports = {
    name: "help",
    description: "Get a list of commands, or help with a specific command.",
    usage: "[command]",
    args: false,
    cooldown: 3,
    async execute(client, message, args) {
        const cmdmap = client.commands.filter(x => !x.hidden).map(x => x.name)
        const prefix = client.config.prefix
        const revision = require('child_process')
            .execSync('git rev-parse --short HEAD')
            .toString().trim()
        let helpEmbed = new MessageEmbed()

        if (!args.length) {
            let length = 0

            for (let [_, module] of client.modules) {
                let moduleEnabled = await isModuleEnabled(message.guildID, module.db)
                if (!moduleEnabled && module.db != "base") continue;
                commandNamesArray = module.commands.map((cmd) => cmd.name)
                length += commandNamesArray.length
                helpEmbed.addField(`${module.name} module`, commandNamesArray.join(", "))
            }

            return message.channel.sendEmbed(helpEmbed
                .setColor("#6666aa")
                .setTitle(length + " commands")
                .setFooter(`Want help using a specific command? Use ${prefix}help [command name]. • Nibble ${revision}`)
            )
        }

        const name = args[0].toLowerCase();
        const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.sendEmbed(helpEmbed
                .setColor("#aa6666")
                .setTitle("Invalid command.")
            )
        }

        helpEmbed.setColor("#6666aa")

        let m = command.name.split('')
        m[0] = m[0].toUpperCase();
        m = m.join('')

        helpEmbed.setTitle(m);

        if (command.description) helpEmbed.setDescription(command.description)

        if (command.aliases) helpEmbed.addField("Aliases: ", command.aliases.join(", "))
        if (command.usage) helpEmbed.addField("Usage: ", `\`${prefix}${command.name} ${command.usage}\``)
        helpEmbed.addField("Module: ", client.modules.get(command.module).name)
        if (command.usage) helpEmbed.setFooter("Arguments in [] are optional. Arguments in <> are required.")

        message.channel.sendEmbed(helpEmbed)
    }
}