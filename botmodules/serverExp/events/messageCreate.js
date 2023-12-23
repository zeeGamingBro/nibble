const { PrismaClient } = require("@prisma/client");
const Eris = require("eris");
const { isModuleEnabled } = require("../../../util/moduleUtil");
const prisma = new PrismaClient()

module.exports = {
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @returns 
     */
    async handle(client, message) {
        let enabled = await isModuleEnabled(message.guildID, this.module)
        if (!enabled) return
        if (message.author.bot) return;
        if (message.channel.type == undefined) return;
        
        if (Math.random() > 0.8) {
            const randomExp = parseInt(Math.random() * 4) + 1
            let user = await prisma.guildMember.upsert({
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
                update: {
                    exp: {increment: randomExp}
                }
            })

            const xpToLevel = 4 * (user.level ** 2) + 50 * user.level + 100

            if (user.exp >= xpToLevel) {
                await prisma.guildMember.upsert({
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
                    update: {
                        exp: user.exp - xpToLevel,
                        level: {increment: 1}
                    }
                })
            }
        }
    }
}