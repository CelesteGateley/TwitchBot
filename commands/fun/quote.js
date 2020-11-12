const fs = require('fs');
const jsonFile = global.appRoot + "/quotes.json"

function write(json) {
    let data = JSON.stringify(json);
    fs.writeFileSync(jsonFile, data);
}

function read() {
    let file = fs.readFileSync(jsonFile);
    return JSON.parse(file);
}

module.exports = {
    // The default name of the command
    name: "quote",
    // The Category of the command (Used for help)
    category: "fun",
    // Description of the command for the help menu
    description: "Add or get quotes",
    // Aliases that the command will also trigger
    aliases: [],
    // Additional values that the command would require, to be added to help
    usage: 'add (name) (quote)',
    // If the command REQUIRES arguments, then this should be set to true
    args: false,
    // Code to be executed when the command is run
    twitchExecute(client, channel, sender, message, args) {
        let quotes = read();
        let isMod = (sender.mod || sender['user-type'] === 'mod') || channel.slice(1) === sender.username;
        if (args.length > 0) {
            if (args[0] === "add" && isMod) {
                args.shift();
                let who = args.shift();
                let quote = args.join(" ");
                quotes['quotes'].push({ "who": who, "quote": quote, "when": new Date().getFullYear() })
                write(quotes);
                return client.say(channel, "Saved quote as number " + quotes['quotes'].length);
            } else if (args[0] === "delete" && isMod) {
                if (!isNaN(args[1]) && quotes['quotes'].length >= parseInt(args[1])) {
                    quotes['quotes'][parseInt(args[1])] = null;
                    return client.say(channel, "Removed quote " + args[1]);
                } else {
                    return client.say(channel, "Quote " + args[1] + " does not exist!");
                }
            } else if (args[0] === "count") {
                return client.say(channel, "There are " + quotes['quotes'].length + " quotes stored!");
            } else if (!isNaN(args[0]) && quotes['quotes'].length >= parseInt(args[0])) {
                let message = "\"" + quotes['quotes'][parseInt(args[0])-1]['quote'] + "\" -"
                    + quotes['quotes'][parseInt(args[0])-1]['who'] + " (" + quotes['quotes'][parseInt(args[0])-1]['when'] + ")";
                return client.say(channel, message);
            } else {
                return client.say(channel, "Quote " + args[0] + " does not exist!");
            }
        }
        let random = Math.floor(Math.random() * (quotes['quotes'].length));
        message = "\"" + quotes['quotes'][random]['quote'] + "\" -"
            + quotes['quotes'][random]['who'] + " (" + quotes['quotes'][random]['when'] + ")";
        return client.say(channel, message);
    },
    discordExecute(message, args) {

    },
};