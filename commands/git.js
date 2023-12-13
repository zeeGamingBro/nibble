/* eslint-disable */ // delete this line if you're using ping as a template
const MessageEmbed = require("davie-eris-embed")
const Eris = require("eris")
const child = require('child_process')
/* eslint-enable */

module.exports = {
    name: 'git',
    description: 'View Git info',
    usage: '',
    args: false,
    aliases: ["info", "github", "version", "patchnotes", "changes", "code"],
    /**
     * 
     * @param {Eris.Client} client 
     * @param {Eris.Message} message 
     * @param {Array.<string>} args 
     */
    async execute(client, message, args) {
        let beast = new MessageEmbed()
        let commitinfo = child.execSync(`git log -1 --pretty="%B ^^ %at ^^ %h ^^ %aN"`).toString().trim()
        let giturl = child.execSync("git remote get-url origin").toString().replace(".git", "").trim()
        commitinfo = commitinfo.split(" ^^ ")
        console.log(commitinfo)

        commitmessage = commitinfo[0].trim()
        commitdate = `<t:${commitinfo[1]}>`
        commithash = commitinfo[2].toUpperCase().trim()
        authorname = commitinfo[3].trim()

        beast.setTitle("Commit " + commithash)
        beast.setDescription("Pushed at " + commitdate + " by " + authorname + "\n\n```\n" + commitmessage + "```")
        beast.setFooter("Repo: " + giturl)

        message.channel.sendEmbed(beast)
    }
}