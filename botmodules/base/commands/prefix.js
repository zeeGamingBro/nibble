/* eslint-disable */ // delete this line if you're using ping as a template
const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
/* eslint-enable */

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    name: 'prefix',
    description: 'Change Nibble\'s prefix in this server.',
    usage: '<new prefix | "reset">',
    aliases: ["setprefix"],
    args: true,
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
                .setTitle("You do not have permission to change the prefix for this server.")
                .setDescription("Manage Server permission is required to change the bot prefix.")
            )
        }

        newpfx = args.join(" ").trim() // some people want case-sensitivity and spaces or whatever
        data = {}

        if (newpfx == "reset") {
            data = await prisma.guildModules.upsert({
                where: {
                    guildId: message.guildID
                },
                update: {
                    prefix: client.config.prefix
                },
                create: {
                    guildId: message.guildID,
                    prefix: client.config.prefix
                }
            })
        } else {
            data = await prisma.guildModules.upsert({
                where: {
                    guildId: message.guildID
                },
                update: {
                    prefix: newpfx
                },
                create: {
                    guildId: message.guildID,
                    prefix: newpfx
                }
            })
        }

        await message.channel.sendEmbed((new MessageEmbed())
            .setTitle("Prefix set to " + data.prefix)
            .setColor(`#66aa66`)
        )
    }
}