/* eslint-disable */ // delete this line if you're using ping as a template
const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
/* eslint-enable */

module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    args: false,
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        message.channel.createMessage("Ping!")
    }
}