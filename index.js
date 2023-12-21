const { Client, Collection, TextChannel } = require("eris");
const { readdirSync, existsSync } = require("fs");

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
client.modules = [];

client.loadModules = () => {
    return readdirSync("./botmodules/")
}

client.loadEventsFromModule = (moduleName) => {
    let eventBasePath = `./botmodules/${moduleName}/events/`
    let eventListing = null
    try {
        eventListing = readdirSync(eventBasePath) || null
    } finally {
        if (!eventListing || !existsSync(eventBasePath) || eventListing.length <= 0 ) return
    }

    eventListing.forEach(event => {
        delete require.cache[require.resolve(`${eventBasePath}${event}`)];

        const eventName = event.split('.')[0];
        const eventFile = require(`${eventBasePath}${event}`);

        client.events.set(eventName, eventFile)

        client.on(eventName, eventFile.bind(null, client))
    })
    console.log(`Successfully loaded ${eventListing.length} events from ${moduleName}`)
}

client.loadCommandsFromModule = (moduleName) => {
    let commandBasePath = `./botmodules/${moduleName}/commands/`
    let commandListing = null
    try {
        commandListing = readdirSync(commandBasePath) || null
    } finally {
        if (!commandListing || !existsSync(commandBasePath) || commandListing.length <= 0 ) return
    }

    commandListing.forEach(command => {
        delete require.cache[require.resolve(`${commandBasePath}${command}`)];

        const commandName = command.split('.')[0];
        const commandFile = require(`${commandBasePath}${command}`);

        commandFile["module"] = moduleName;

        client.commands.set(commandName, commandFile)
    })
    console.log(`Successfully loaded ${commandListing.length} commands from ${moduleName}`)
}

client.loadConfig = () => {
    delete require.cache[require.resolve("./config.json")]
    config = require("./config.json")
    client.config = config;
}

client.loadConfig();
client.modules = client.loadModules();

client.modules.forEach((modulename) => {
    console.log("try to load " + modulename)
    if (!existsSync("./botmodules/" + modulename)) {
        console.err(`module ${modulename} does not exist`)
        return
    }

    client.loadEventsFromModule(modulename);
    client.loadCommandsFromModule(modulename);
    console.log("finished loading " + modulename + "\n")
})

client.connect()

client.on("error", function (err) {
    client.connect();
})