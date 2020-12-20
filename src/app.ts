import * as db from "./database";
import * as dcBot from "./discordBot";
import * as expressManager from "./express/expressManager";

db.init();

dcBot.init();

expressManager.init();