const Eris = require("eris")
const { isModuleEnabled } = require("../../../util/moduleUtil")
const { PrismaClient } = require("@prisma/client")
const MessageEmbed = require("davie-eris-embed")
const prisma = new PrismaClient()

/**
 * @param {Eris.Client} client
 * @param {Eris.Message} message
 * @param {Eris.Emoji} emoji 
 * @param {(Eris.Member)} reactor
 */
module.exports = {
    async handle(client, message, emoji, reactor) {
        let enabled = await isModuleEnabled(message.guildID, this.module)
        if (!enabled || !message.guildID) return;

        let identifier = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name 
        let fetchedMessage = await message.channel.getMessage(message.id)
        let starboardSettings = await prisma.guildStarboardSettings.upsert({
            create: {
                guildId: fetchedMessage.guildID
            },
            where: {
                guildId: fetchedMessage.guildID
            },
            update: {}
        })
        if (identifier == starboardSettings.starboardEmoji) {
            let reactionCount = fetchedMessage.reactions[identifier].count
            let reactionsNeeded = starboardSettings.starsRequired
            let channel;
            let alreadyStarred = true;

            const starredMessage = await prisma.starredMessage.findFirst({ where: { messageId: fetchedMessage.id } })
            if (!starredMessage) alreadyStarred = false;

            if (reactor.id == fetchedMessage.author.id && !starboardSettings.starOwnMessages) {
                return await fetchedMessage.removeReaction(identifier, reactor.id)
            }

            if ((reactionCount >= reactionsNeeded) && (starboardSettings.starboardChannel != null) && !alreadyStarred) {
                let channel = client.getChannel(starboardSettings.starboardChannel)
                let starEmbed = (new MessageEmbed())
                    .setTitle(`${fetchedMessage.author.username} sent in ${fetchedMessage.channel.mention}`)
                    .setColor("#fcd049")
                    .setDescription((fetchedMessage.content || "") + `\n\n[Jump to message](${fetchedMessage.jumpLink})`)
                    .setTimestamp(fetchedMessage.timestamp)
                
                if (fetchedMessage.attachments) {
                    let imageSet = false
                    fetchedMessage.attachments.forEach(element => {
                        if (element.content_type.startsWith("image/") && !imageSet) {
                            starEmbed.setImage(element.url)
                            imageSet = true;
                            return
                        }
                    });
                }
                channel.sendEmbed(starEmbed)
                await prisma.starredMessage.create({data: { messageId: fetchedMessage.id }})
            }
        }
    }
}