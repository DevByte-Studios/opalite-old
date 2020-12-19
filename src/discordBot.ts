import * as Discord from "discord.js";
const config = require("../opalite.json");

const client = new Discord.Client();

export async function init() {
    client.login(config.bot_token);
}

export async function notifySuspension(discordId) {
    let user = client.users.cache.get('357871005093462019');
    if (user != undefined) {
        user.send(new Discord.MessageEmbed()
            .setColor("#ffb01f")
            .setTitle("Your product has been suspended!"))
    }
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (msg.content === "hey bot") {
        notifySuspension(msg.author.id);
    }
});
