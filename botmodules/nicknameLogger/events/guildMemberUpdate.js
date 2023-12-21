const Eris = require("eris")
const { isModuleEnabled } = require("../../../util/moduleUtil")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
/**
 * 
 * @param {Eris.Guild} guild 
 * @param {Eris.Member} member 
 * @param {(string|null)} oldMember 
 */
module.exports = {
    async handle(client, guild, member, oldMember) {
        if (!isModuleEnabled(guild.id, this.module)) return
        if (member.user.bot) return;
        if (member.nick == oldMember.nick) return;
        console.log(`User ${member.username} (${member.id}) updated nickname in ${guild.name} (${guild.id}) to ${member.nick}`)
        await prisma.nickname.create({
            data: {
                setAt: new Date(),
                name: member.nick != null ? member.nick : "Nickname reset",
                GuildMember: {
                    connectOrCreate: {
                        where: {
                            userId_guildId: {
                                userId: member.id,
                                guildId: guild.id
                            }
                        },
                        create: {
                            userId: member.id,
                            guildId: guild.id
                        }
                    }
                }
            }
        })
    }
}