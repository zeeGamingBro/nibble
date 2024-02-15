const MessageEmbed = require("davie-eris-embed")
const { getUserFromID } = require("../../../util/stringUtil")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const resultsPerPage = 10

module.exports = {
    name: 'xpleaderboard',
    description: 'Who has the most XP in your server? Find out here!',
    usage: '[page]',
    aliases: ["xplb"],
    args: false,
    async execute(client, message, args) {
        let page = parseInt(args[0]) - 1 || 0
        let funny = ""

        let people = await prisma.guildMember.findMany({
            where: {
                exp: { gt: 0 }, guildId: message.guildID
            },
            orderBy: {
                exp: "desc"
            }
        })

        title = "XP: Page " + (page + 1) + "\n"
        let i = 0

        if (people.length > resultsPerPage) {
            people = await prisma.guildMember.findMany({
                where: {
                    exp: { gt: 0 }, guildId: message.guildID
                },
                orderBy: {
                    exp: "desc"
                },
                skip: resultsPerPage * page,
                take: resultsPerPage
            })

            i += (resultsPerPage * page)
        }

        people.forEach(person => {
            i++
            let user = getUserFromID(client, person.userId)

            let level = Math.floor(Math.sqrt(person.exp) / 3)
            level = Math.max(level, 1)

            funny += `${i}. `
            funny += user.mention + " has `"
            funny += person.exp
            funny += ` XP\` (level \`${person.level}\`)\n`
        })

        message.channel.sendEmbed(new MessageEmbed()
            .setTitle(title)
            .setDescription(funny)
            .setFooter("Next page: )xplb " + (page + 2))
            .setColor("#6666aa")
        )
    }
}