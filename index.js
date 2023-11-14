const { Client, Collection, TextChannel } = require("eris");
const { readdirSync } = require("fs");

TextChannel.prototype.sendEmbed = function sendEmbed(EmbedBuilder) {
    return this.createMessage(EmbedBuilder.create)
}
let config = require("./config.json");

const client = new Client(config.botToken, {
    intents: [
        "all", "guildMembers", "guilds"
    ]
})

client.events = new Collection();
client.commands = new Collection();

client.loadEvents = () => {
    let eventListing = readdirSync("./events/")
    eventListing.forEach(event => {
        delete require.cache[require.resolve(`./events/${event}`)];

        const eventName = event.split('.')[0];
        const eventFile = require(`./events/${event}`);

        client.events.set(eventName, eventFile)

        client.on(eventName, eventFile.bind(null, client))
    })
    console.log(`Successfully loaded ${eventListing.length} events`)
}

client.loadCommands = () => {
    let commandListing = readdirSync("./commands/")
    commandListing.forEach(command => {
        delete require.cache[require.resolve(`./commands/${command}`)];

        const commandName = command.split('.')[0];
        const commandFile = require(`./commands/${command}`);

        client.commands.set(commandName, commandFile)
    })
    console.log(`Successfully loaded ${commandListing.length} commands`)
}

client.loadConfig = () => {
    delete require.cache[require.resolve("./config.json")]
    config = require("./config.json")
    client.config = config;
}

client.loadEvents();
client.loadCommands();
client.loadConfig();

client.connect()

client.on("error", function (err) {
    client.connect();
})