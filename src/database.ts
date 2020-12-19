import * as path from "path";
import { simpleflake } from "simpleflakes";

import sqlite3_, { Database } from "sqlite3";
const sqlite3 = sqlite3_.verbose();

var db: Database;

export async function init() {
    db = new sqlite3.Database(path.join(__dirname, '../opalite.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => console.error);
    initTables();
}

export async function discordRegister(discordId: string, callback) {
    db.get("SELECT uid, permission FROM users WHERE discord=?", [discordId], (err, row) => {
        if (row == undefined) {
            const flake = simpleflake().toString(36) + "";
            db.run("INSERT INTO users(uid, discord, credits, permission) VALUES (?, ?, ?, ?)", [flake , discordId, 0, 0]);
            callback(flake, 0);
        } else {
            callback(row.uid, row.permission);
        }
    });
}

export async function addCredits(uid: string, credits: number) {
    db.run("UPDATE users SET credits = credits + ? WHERE uid=?", [credits, uid]);
}

export async function isPaymentClaimed(paymentID: string, callback) {
    db.get("SELECT claimedAt FROM transactions WHERE id=?", [paymentID], (err, row) => {
        if (row == undefined)
            callback();
    });
}

export async function claimPayment(paymentID: string, user: string) {
    db.run("INSERT INTO transactions(id, claimedAt, user) VALUES(?, ?, ?)", [paymentID, Math.floor(Date.now() / 1000), user]);
}

export function getUser(uid: string, callback) {
    db.get("SELECT * FROM users WHERE uid=?", [uid], (err, row) => {
        callback(row);
    });
}

function initTables() {
    db.run("CREATE TABLE IF NOT EXISTS users(uid TEXT, discord TEXT, credits INTEGER, permission INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS transactions(id TEXT, claimedAt INTEGER, user TEXT)");
}