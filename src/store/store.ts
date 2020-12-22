import { Router } from "express";
import * as db from "./db/database";
import * as dcBot from "./discordBot/discordBot";
import * as router from "./routes/router";

export async function init() {
    db.init();

    dcBot.init();

    router.init();
}