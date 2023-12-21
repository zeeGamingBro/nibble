const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
const { isModuleEnabled } = require("../../../util/moduleUtil")

module.exports = {
    name: 'modules',
    description: 'View this server\'s enabled/disabled modules',
    usage: '',
    args: false,
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        let embed = new MessageEmbed()
        embed.setTitle("Modules for " + message.channel.guild.name)
        embed.setColor("#6666aa")

        for (const manifest of client.modules.values()) {
            enabled = (await isModuleEnabled(message.guildID, manifest.db)) ? "Enabled" : "Disabled"
            if (manifest.name == "Base") enabled = "Enabled"
            embed.addField(`${manifest.name} {${enabled}}`, manifest.desc)
        }

        await message.channel.sendEmbed(embed)
        
    }
}