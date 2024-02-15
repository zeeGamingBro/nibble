/* eslint-disable */ // delete this line if you're using ping as a template
const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
const { getUserFromID } = require("../../../util/stringUtil")
/* eslint-enable */

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    name: 'nicks',
    description: 'View someone\'s logged nicknames',
    usage: '[setting <value>]',
    aliases: ["sbs"],
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        if (args.length == 0 || args[0].trim() == "" || !args[0]) {
            // Just list off settings
            let starboardSettings = await prisma.guildStarboardSettings.upsert({
                create: {
                    guildId: message.guildID
                },
                where: {
                    guildId: message.guildID
                },
                update: {}
            })

            let channelname = "None set"

            if (starboardSettings.starboardChannel != null) {
                channelname = "#" + client.getChannel(starboardSettings.starboardChannel).name
            }

            message.channel.sendEmbed((new MessageEmbed())
                .setTitle(`Starboard settings for ${message.channel.guild.name}`)
                .setColor("#fcd049")
                .addField(`starboardChannel: ${channelname}`, "Channel that starred messages will be saved to. Stars do nothing if this is not set.")
                .addField(`starboardEmoji: ${starboardSettings.starboardEmoji}`, "Emoji to react to messages with to star them")
                .addField(`starsRequired: ${starboardSettings.starsRequired}`, "How many reactions should be required to save a message?")
                .addField(`starOwnMessages: ${starboardSettings.starOwnMessages}`, "Should a user's own reaction count towards the star count?")
                .setFooter("Use )starboardsettings (settingname) (value) to change a setting.")
            )    
        } else {
            if (!message.member.permissions.has("manageChannels")) {
                return message.channel.sendEmbed((new MessageEmbed())
                    .setColor("#aa6666")
                    .setTitle("You do not have permission to change starboard settings in this server.")
                    .setDescription("Manage Channels permission is required to change starboard settings.")
                )
            }
            const validSettings = ["starboardchannel", "starboardemoji", "starsrequired", "starownmessages"]
            const dbName        = ["starboardChannel", "starboardEmoji", "starsRequired", "starOwnMessages"]

            let setting = args[0].toLowerCase()
            const dbsetting = dbName[validSettings.indexOf(setting)]
            setting = validSettings[dbName.indexOf(dbsetting)]

            if (!validSettings.includes(setting) || !setting || !dbsetting) {
                return message.channel.sendEmbed((new MessageEmbed())
                    .setColor("#aa6666")
                    .setTitle("Invalid setting.")
                    .setDescription(`Valid settings: ${dbName.join(", ")}`)
                    .setFooter("Run )starboardsettings with no arguments to view settings")
                )
            }

            if (!args[1] && setting != "starownmessages") {
                return message.channel.sendEmbed((new MessageEmbed())
                    .setColor("#aa6666")
                    .setTitle("A value is required for this setting.")
                    .setFooter("Run )starboardsettings with no arguments to view settings")
                )
            }

            if (setting == "starboardchannel") {
                const sterilized = args[1].replace("<#", "").replace(">", "")
                let channel = await client.getChannel(sterilized) || null
                if (!channel || !channel.type == 0) {
                    return message.channel.sendEmbed((new MessageEmbed())
                        .setColor("#aa6666")
                        .setTitle("Could not find that text channel.")
                        .setDescription("Try mentioning a channel or sending an ID.")
                    )
                } else {
                    let starboardSettings = await prisma.guildStarboardSettings.upsert({
                        create: {
                            guildId: message.guildID
                        },
                        where: {
                            guildId: message.guildID
                        },
                        update: {
                            starboardChannel: channel.id
                        }
                    })
                    message.channel.sendEmbed((new MessageEmbed())
                        .setTitle("Successfully set starboard channel to " + channel.mention + ".")
                        .setDescription("Make sure the bot has permission to Send Messages and Embed Files in " + channel.mention + "!")
                        .setColor("#fcd049")
                    )
                }
            } else if (setting == "starboardemoji") {
                message.channel.createMessage("not implemented")
            } else if (setting == "starsrequired") {
                let amount = parseInt(args[1].trim())
                if (amount == NaN || !amount) {
                    return message.channel.sendEmbed((new MessageEmbed())
                        .setTitle("Invalid value.")
                        .setDescription("Amount of stars must be a number.")
                        .setColor("#aa6666")
                    )
                }

                let starboardSettings = await prisma.guildStarboardSettings.upsert({
                    create: {
                        guildId: message.guildID
                    },
                    where: {
                        guildId: message.guildID
                    },
                    update: {
                        starsRequired: amount
                    }
                })
                message.channel.sendEmbed((new MessageEmbed())
                    .setTitle(`${amount} stars are now required to starboard a message.`)
                    .setColor("#fcd049")
                )
            } else if (setting == "starownmessages") {
                let starboardSettings = await prisma.guildStarboardSettings.upsert({
                    create: {
                        guildId: message.guildID
                    },
                    where: {
                        guildId: message.guildID
                    },
                    update: {}
                })

                await prisma.guildStarboardSettings.upsert({
                    create: {
                        guildId: message.guildID
                    },
                    where: {
                        guildId: message.guildID
                    },
                    update: {
                        starOwnMessages: !starboardSettings.starOwnMessages
                    }
                })

                message.channel.sendEmbed((new MessageEmbed())
                    .setTitle(`Users now ${!starboardSettings.starOwnMessages ? "can" : "cannot"} star their own messages.`)
                    .setColor("#fcd049")
                )
            }
        }
    }
}