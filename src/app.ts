import * as expressManager from "./express/expressManager";
import * as db from "./store/database";
import * as dcBot from "./store/discordBot";

db.init();

dcBot.init();

expressManager.init();