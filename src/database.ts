import * as path from "path";

import sqlite3_ from "sqlite3";
const sqlite3 = sqlite3_.verbose();

export async function init() {
    const db = new sqlite3.Database(path.join(__dirname, '../opalite.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => console.error);
}