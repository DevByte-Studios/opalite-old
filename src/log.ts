import { db } from "./store/database";

enum logType {

}

export async function log(type: logType, message: string, user: string) {
    db.run("INSERT INTO logs(uid, type, timestamp, user, message) VALUES (?, ?, ?, ?, ?)",
        [
            "SNOWKFLAEW",
            logType[type],
            Math.floor(Date.now() / 1000),
            user,
            message
        ]);
}