import { db } from "./database";
import { simpleflake } from "simpleflakes";

enum logType {

}

export async function log(type: logType, message: string, user: string) {
    db.run("INSERT INTO logs(uid, type, timestamp, user, message) VALUES (?, ?, ?, ?, ?)",
        [
            simpleflake().toString(36) + "",
            logType[type],
            Math.floor(Date.now() / 1000),
            user,
            message
        ]);
}