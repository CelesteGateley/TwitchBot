module.exports = {
    // The default name of the command
    name: "dice",
    // The Category of the command (Used for help)
    category: "core",
    // Description of the command for the help menu
    description: "Roll a dice!",
    // Aliases that the command will also trigger
    aliases: [],
    // Additional values that the command would require, to be added to help
    usage: '',
    // If the command REQUIRES arguments, then this should be set to true
    args: false,
    // Code to be executed when the command is run
    execute(client, target, message, args) {
        const sides = 6;
        client.say(target,"You rolled a " + Math.floor(Math.random() * sides) + 1);
    },
};