let channels = []
const {channel} = require('../../config.json')

module.exports = {
    // The default name of the command
    name: "multi",
    // The Category of the command (Used for help)
    category: "utility",
    // Description of the command for the help menu
    description: "Show the users ",
    // Aliases that the command will also trigger
    aliases: ["duo", "trio"],
    // Additional values that the command would require, to be added to help
    usage: '',
    // If the command REQUIRES arguments, then this should be set to true
    args: false,
    // Code to be executed when the command is run
    twitchExecute(client, channel, sender, message, args) {
        let isMod = (sender.mod || sender['user-type'] === 'mod') || channel.slice(1) === sender.username;
        if (args.length > 0) {
            if (isMod) {
                if (args[0] === "clear") {
                    channels = [];
                    return client.say("Removed the multistream channels!");
                } else {
                    channels = [channel.slice(1),]
                    for (let x in args) { channels.push(args[x]); }
                }
            }
        }
        if (channels.length === 0) return client.say(channel, "I'm not currently multistreaming!");
        let strChannels = "";
        for (let x in channels) { strChannels += channels[x] + "/" }
        return client.say(channel, "I'm multistreaming! Watch us all at https://multistre.am/" + strChannels + "layout4")
    },
    discordExecute(message, args) {
        if (args.length > 0) {
            if (message.member.permissions.has("ADMINISTRATOR") === true) {
                if (args[0] === "clear") {
                    channels = [];
                    return message.reply("Removed the multistream channels!");
                } else {
                    channels = [channel,]
                    for (let x in args) {
                        channels.push(args[x]);
                    }
                }
            }
        }
        if (channels.length === 0) {l
            return message.reply("I'm not currently multistreaming!")
        }
        let strChannels = "";
        for (let x in channels) {
            strChannels += channels[x] + "/"
        }
        return message.reply("I'm multistreaming! Watch us all at https://multistre.am/" + strChannels + "layout4")
    },
};