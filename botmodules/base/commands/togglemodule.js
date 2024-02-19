const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
const { isModuleEnabled } = require("../../../util/moduleUtil")

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    name: 'togglemodule',
    description: 'Control if a module is enabled or disabled.',
    usage: '<module name>',
    args: true,
    aliases: ["tm"],
    permissions: ["manageGuild"],
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {

        if (!message.member.permissions.has("manageGuild")) {
            return message.channel.sendEmbed((new MessageEmbed())
                .setColor("#aa6666")
                .setTitle("You do not have permission to change module settings in this server.")
                .setDescription("Manage Server permission is required to change module settings.")
            )
        }

        let module = args[0].trim().toLowerCase()

        if (module.trim().toLowerCase() == "base") {
            return message.channel.sendEmbed((new MessageEmbed())
                .setTitle("Base module cannot be disabled.")
                .setColor("#aa6666")
            )
        }

        
        module = client.modules.find((mdl) => mdl.name.toLowerCase() == module) || null
        if (!module || !module.db) {
            return message.channel.sendEmbed((new MessageEmbed())
                .setTitle("Could not find module.")
                .setDescription("You can see what modules exist with `)modules`.")
                .setColor("#aa6666")
            )
        }

        let moduleEnabled = await isModuleEnabled(message.guildID, module.db)

        data = await prisma.guildModules.upsert({
            where: {
                guildId: message.guildID
            },
            update: {
                [module.db]: !moduleEnabled
            },
            create: {
                guildId: message.guildID
            }
        })


        await message.channel.sendEmbed((new MessageEmbed())
            .setTitle(`${moduleEnabled ? "Disabled" : "Enabled"} module ${module.name}.`)
            .setDescription(moduleEnabled ? (module.disabledMessage || "") : (module.enabledMessage || ""))
            .setColor(`${moduleEnabled ? "#aa6666" : "#66aa66"}`)
        )
        
    }
}