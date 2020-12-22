import * as Discord from "discord.js";
import { checkSubscriptions } from "../subscription/subscription";
const config = require("../../../opalite.json");

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
            .setFooter("Opalite", "https://i.imgur.com/9bwePwM.png")
            .setURL("https://opalite.gg/store")
            .setDescription("Please purchase more credits on our store page.")
            .setTimestamp()
            .addField("\u200b", "\u200b")
            .addField("Due Date", "12/07/2020 8:56PM", true)
            .addField("Price", "500 Credits", true)
            .addField("Remaining", "500 Credits", true)
            .addField("\u200b", "\u200b")
            .addField("Click here to purchase more credits:", "https://opalite.gg/store")
            .setThumbnail("https://raw.githubusercontent.com/P3ntest/wumpus/main/images/warning.png")
            .setTitle("You don't have enough credits for your subscription!"))
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
        notifyPrior(msg.author.id);
    }
});
