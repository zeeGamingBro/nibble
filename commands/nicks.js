/* eslint-disable */ // delete this line if you're using ping as a template
const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
const { getUserFromID } = require("../util/stringUtil")
/* eslint-enable */

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    name: 'nicks',
    description: 'View someone\'s logged nicknames',
    usage: '[page] [user]',
    aliases: ["nicknames", "whowas"],
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        let resultsPerPage = 10
        let page = parseInt(args[0] - 1) || 0

        if (page <= -1) page = 0 // we have an offset

        beastembed = new MessageEmbed()

        let start = (page * resultsPerPage)
        let stop = start + resultsPerPage

        let user = getUserFromID(client, args[1]) || message.author

        embedBody = ""
        myFunny = await prisma.guildMember.findUnique({
            where: {
                userId_guildId: {
                    userId: user.id,
                    guildId: message.guildID
                }
            },
            include: {
                nicknames: true
            }
        })
        if (!myFunny?.nicknames) {
            embedBody = "No logged nicknames for this user."
        } else {
            results = myFunny.nicknames.sort((a, b) => {
                return new Date(b.setAt) - new Date(a.setAt)
            })
            results = results.slice(start, stop)
            results.forEach((result, idx) => {
                beastembed.addField(result.name, `set at <t:${parseInt(result.setAt.valueOf() / 1000)}:f>`, false)
            })
        }

        message.channel.sendEmbed(beastembed
            .setTitle("Past nicknames for " + user.username)
            .setFooter(`Page ${page + 1}`)
            .setDescription(embedBody)
        )
        console.log(myFunny)
    }
}