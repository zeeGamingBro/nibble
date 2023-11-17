const Eris = require("eris")
const fs = require("fs")

let changeInterval = undefined;

/**
 * 
 * @param {Eris.Client} bot 
 */
module.exports = async (bot) => {
    console.log(`Logged into discord as ${bot.user.username}`)
    
    clearInterval(changeInterval) // We have no guarantee ready only fires once

    let eventListing = fs.readdirSync("./events/")
    eventListing.forEach((value, index, array) => {
        array[index] = value.replace("/", "").replace("\\", "").replace(".js", "")
        if (array[index] == "ready") delete array[index]
    })
    eventListing = eventListing.filter(n => n)

    bot.editStatus("online", {
        name: `*yawn*`,
        type: 0
    })

    changeInterval = setInterval(changeStatus, 2 * 60 * 1000, bot, eventListing)

}

function changeStatus(bot, events) {
    bot.editStatus("online", {
        name: `${events[Math.floor(Math.random()*events.length)]} events`,
        type: 2
    })
}