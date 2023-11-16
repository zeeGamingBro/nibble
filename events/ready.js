const Eris = require("eris")

/**
 * 
 * @param {Eris.Client} bot 
 */
module.exports = async (bot) => {
    console.log("Event handled: ready")
    console.log(`Logged into discord as ${bot.user.username}`)
    bot.editStatus("online", {
        name: "nickname updates",
        type: 2
    })
}