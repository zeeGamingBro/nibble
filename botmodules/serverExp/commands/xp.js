const { PrismaClient } = require("@prisma/client")
const { getUserFromID } = require("../../../util/stringUtil")
const MessageEmbed = require("davie-eris-embed")

const prisma = new PrismaClient()

module.exports = {
    name: 'xp',
    description: 'Check the exp of yourself or another user.',
    usage: '[user]',
    aliases: ["exp", "xp"],
    async execute(client, message, args) {
        let user = getUserFromID(client, args[0]) || message.author
        let guildID = message.guildID

        let memberObject = await prisma.guildMember.upsert({
            where: {
                userId_guildId: {
                    guildId: message.guildID,
                    userId: message.author.id
                }
            },
            create: {
                guildId: message.guildID,
                userId: message.author.id
            },
            update: {}
        })

        let toNextLevel = 4 * (memberObject.level ** 2) + 50 * memberObject.level + 100
        toNextLevel = toNextLevel - memberObject.exp;

        message.channel.sendEmbed((new MessageEmbed())
            .setTitle(`XP for ${user.username}`)
            .addField("XP", memberObject.exp, true)
            .addField("Level", `Level **${memberObject.level}**`, true)
            .addField("Next level", `${toNextLevel} XP`, false)
            .setColor("#6666aa")
        )
    }
}