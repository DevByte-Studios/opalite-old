import * as Discord from "discord.js";
import { cache } from "ejs";
import { checkSubscriptions } from "./subscription";
const config = require("../opalite.json");

const client = new Discord.Client();

export async function init() {
    await client.login(config.bot_token);
}

export async function notifySuspension(discordId) {
    let user = client.users.cache.get(discordId);
    if (user != undefined) {
        user.send(new Discord.MessageEmbed()
            .setColor("#ffb01f")
            .setTitle("Your product has been suspended!"))
    }
}

export async function notifyPrior(discordId) {
    let user = client.users.cache.get(discordId);
    if (user != undefined) {
        user.send(new Discord.MessageEmbed()
            .setColor("#ffb01f")
            .setTitle("You will not be able to pay for your product! Pls charge your credits"))
    }
}


client.on("ready", async () => {
    await cacheAllMembers();
    checkSubscriptions();
});

async function cacheAllMembers() {
    let guilds = Array.from(client.guilds.cache);
    for (let i = 0; i < guilds.length; i++) {
        await guilds[i][1].members.fetch();
    }
}

client.on("message", msg => {
    if (msg.content === "hey bot") {
        notifySuspension(msg.author.id);
    }
});
