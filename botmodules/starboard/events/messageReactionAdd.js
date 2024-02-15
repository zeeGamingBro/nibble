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
        console.log(identifier)
        console.log(starboardSettings.starboardEmoji)
        if (identifier == starboardSettings.starboardEmoji) {
            console.log(fetchedMessage.reactions)
            let reactionCount = fetchedMessage.reactions[identifier].count
            let reactionsNeeded = starboardSettings.starsRequired
            let channel;

            if (reactor.id == fetchedMessage.author.id && !starboardSettings.starOwnMessages) {
                return await fetchedMessage.removeReaction(identifier, reactor.id)
            }

            if ((reactionCount >= reactionsNeeded) && (starboardSettings.starboardChannel != null)) {
                let channel = client.getChannel(starboardSettings.starboardChannel)
                let starEmbed = (new MessageEmbed())
                    .setTitle(`${fetchedMessage.author.username} sent in ${fetchedMessage.channel.mention}`)
                    .setColor("#fcd049")
                    .setDescription(fetchedMessage.content);
                
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
            }
        }
    }
}