module.exports = {
    // List of Keywords/Phrases that will trigger the response. Should be in lowercase.
    triggers: [ "hey", "hello", "hi" ],
    // Chance out of 100 that the response will trigger. 100 means that it will always trigger.
    chance: 10,
    // Priority of the trigger. If you have 2 responses that have the same trigger, the lower value priority will be used first.
    priority: 0,
    // Code to execute when the response is triggered.
    twitchExecute(client, target, sender, message) {
        if (sender.username === "monoryuu") {
            client.say(target, "Hewwo thewe @" + sender.username);
        } else {

        client.say(target, "Hello there @" + sender.username);
        }
    },
    discordExecute(message) {

    },
};