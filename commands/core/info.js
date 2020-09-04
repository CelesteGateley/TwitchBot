module.exports = {
    // The default name of the command
    name: "info",
    // The Category of the command (Used for help)
    category: "core",
    // Description of the command for the help menu
    description: "Shows information about the bot",
    // Aliases that the command will also trigger
    aliases: ['about'],
    // Additional values that the command would require, to be added to help
    usage: '',
    // If the command REQUIRES arguments, then this should be set to true
    args: false,
    // Code to be executed when the command is run
    twitchExecute(client, channel, sender, message, args) {
        client.say(channel, "This bot was made by CelesteMagisteel, and is maintained by her!")
    },
    discordExecute(message, args) {
        message.reply("This bot was created by CelesteMagisteel, and is maintained by her!")
    },
};