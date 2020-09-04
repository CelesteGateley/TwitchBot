let schedule = require("../../schedule.json");
let fs = require("fs");
// TODO: Schedule is not saving, CBA fixing as of 04/09/2020
module.exports = {
    // The default name of the command
    name: "schedule",
    // The Category of the command (Used for help)
    category: "utility",
    // Description of the command for the help menu
    description: "Shows a day by day schedule for the week",
    // Aliases that the command will also trigger
    aliases: [],
    // Additional values that the command would require, to be added to help
    usage: '',
    // If the command REQUIRES arguments, then this should be set to true
    args: false,
    // Code to be executed when the command is run
    twitchExecute(client, channel, sender, message, args) {
        let isMod = (sender.mod || sender['user-type'] === 'mod') || channel.slice(1) === sender.username;
        if (isMod) {
            if (args.length > 0) {
                let day = args.shift().toLowerCase();
                if (!(day in schedule)) { return client.say(channel, "Invalid day provided"); }
                if (args.length === 0) { schedule[day] = "No Stream"; return client.say(channel, "Stream removed for " + day); }
                let game = "";
                for (let x in args) { game += args[x] + " "; }
                schedule[day] = game.trim();
                fs.writeFileSync("../../schedule.json", JSON.stringify(schedule, null, 2));
                return client.say(channel, day[0].toUpperCase() + day.substring(1) + " has been set to " + game.trim());
            }
        }
        for (let day in schedule) { client.say(channel, day[0].toUpperCase() + day.substring(1) + ": " + schedule[day]); }
    },
    discordExecute(message, args) {
        if (message.member.permissions.has("ADMINISTRATOR")) {
            if (args.length > 0) {
                let day = args.shift().toLowerCase();
                if (!(day in schedule)) { return message.reply("Invalid day provided"); }
                if (args.length === 0) { schedule[day] = "No Stream"; message.reply("Stream removed for " + day); }
                let game = "";
                for (let x in args) { game += args[x] + " "; }
                schedule[day] = game.trim();
                fs.writeFileSync("../../schedule.json", JSON.stringify(schedule, null, 2));
                return message.reply(day[0].toUpperCase() + day.substring(1) + " has been set to " + game.trim());
            }
        }
        let msg = "The stream schedule is: ```yaml\n";
        for (let day in schedule) { msg += day[0].toUpperCase() + day.substring(1) + ": " + schedule[day] + "\n"; }
        return message.reply(msg + "```")
    },
};