const Eris = require("eris")
const fs = require("fs")

let changeInterval = undefined;

const statusList = ["with LettersBot", "with the nickname machine", "Fortnite", "tic-tac-toe", "around", "something", "football", "blackjack",
                    "Nickname Clicker 2023", "Visual Studio Code", "some tunes"]

/**
 * 
 * @param {Eris.Client} bot 
 */
module.exports = {
    async handle(bot) {
        console.log(`Logged into discord as ${bot.user.username}`)
        
        clearInterval(changeInterval) // We have no guarantee ready only fires once
    
        bot.editStatus("online", {
            name: `*yawn*`,
            type: 0
        })
    
        changeStatus(bot, statusList)
    
        changeInterval = setInterval(changeStatus, 2 * 60 * 1000, bot, statusList)
    
    }
}

function changeStatus(bot, statuses) {
    mystatus = statuses[Math.floor( Math.random()*statuses.length )]

    if ((Math.random() > 0.6) && mystatus != "with LettersBot") {
        if (mystatus.startsWith("with")) {
            mystatus += " and"
        } else {
            mystatus += " with"
        }
        mystatus += " LettersBot"
    }
    if (Math.random() > 0.6) {
        mystatus += " :3"
    }

    bot.editStatus("online", {
        name: mystatus,
        type: 0
    })
}