/* eslint-disable */ // delete this line if you're using ping as a template
const natural = require("natural");
const Eris = require("eris")
/* eslint-enable */

const tagger = new natural.BrillPOSTagger(new natural.Lexicon("EN", "N", "NNP"), new natural.RuleSet("EN"));

module.exports = {
    name: 'processMessage',
    description: 'the brain runs endlessly',
    usage: '<message>',
    args: true,
    aliases: ["pm"],
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        console.log(tagger.tag("yo bruh tf is ur problem"))
    }
}