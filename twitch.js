const tmi = require('tmi.js');
const fs = require('fs');
const config = require('./config.json')
const modules = require('./modules.json')

// Define configuration options
const opts = {
    identity: {
        username: config.client,
        password: config.token
    },
    channels: config.channels
};
// Create a client with our options
const client = new tmi.client(opts);

const commands = {};
for (let x in modules) {
    const commandFiles = fs.readdirSync('./commands/' + x).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) { const command = require(`./commands/` + x + `/${file}`); commands[command.name] = command;  }
}

const responseFiles = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
const responses = {}
for (const file of responseFiles) {
    const response = require(`./responses/${file}`);
    for (const trigger of response.triggers) { responses[("\\b(\\w*" + trigger + "\\w*)\\b")] = response; }
    // Custom Sort function for the response modules, using priority as a basis
    responses.sort(function (a, b) { if (a.priority < b.priority) { return 1; } else if (a.priority === b.priority) { return 0;} else { return -1; }});
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (channel, sender, message, self) {
    if (self) { return; } // Ignore messages from the bot

    const args = message.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    let responded = false;
    for (let response in responses) {
        let regex = new RegExp(response, "gi");
        if (regex.test(message.content) && !responded) {
            if (Math.random() <= value.chance / 100) {
                responses[response].execute(client, channel, sender, message); responded = true;
            }
        }
    }


    if (!message.startsWith(config.prefix)) return;

    const command = commands[commandName];

    if (command == null) return;
    if (command.args && !args.length) {
        return client.say(target, `, You didn't provide any arguments`);
    }

    try {
        command.execute(client, channel, sender, message, args);
    } catch (error) {
        console.error(error);
        client.say('There was an error trying to execute that command!');
    }
}


function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
