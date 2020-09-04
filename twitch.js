const tmi = require('tmi.js');
const discord = require("discord.js")
const fs = require('fs');
const cron = require('node-cron')

const config = require('./config.json')
const modules = require('./modules.json')

let announcementIndex = 0;
let discordClient = new discord.Client();

const opts = {
    identity: {
        username: config.client,
        password: config.token
    },
    channels: config.channels
};
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
    responses.sort(function (a, b) { if (a.priority < b.priority) { return 1; } else if (a.priority === b.priority) { return 0;} else { return -1; }});
}

let discordChannel;

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag} at ${new Date()}!`);
    discordChannel = discordClient.channels.cache.get(config["discord-log-channel"]);
});

client.on('message', function (channel, sender, message, self) {
    if (self) { return; } // Ignore messages from the bot

    if (discordChannel != null) discordChannel.send("**" + sender['display-name'] + ":** " + message);

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
    if (command.args && !args.length) return client.say(channel, `, You didn't provide any arguments`);

    try {
        command.execute(client, channel, sender, message, args);
    } catch (error) {
        console.error(error);
        client.say(channel, 'There was an error trying to execute that command!');
    }
});

client.on('connected', function (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    // Used increments for nicer timings, rather than just every 5 minutes from starting
    cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
        for (let channel in config.channels) client.say(channel, config.announcements[announcementIndex]);
        announcementIndex++;
        if (announcementIndex >= config.announcements.length) announcementIndex = 0;
    })
});

client.connect();
discordClient.login(config["discord-token"])
