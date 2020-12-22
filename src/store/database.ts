import sqlite3_, { Database } from "sqlite3";
import path from "path";

import { tables } from "./tables.json";

const sqlite3 = sqlite3_.verbose();
export var db: Database;

export async function init() {
    db = new sqlite3.Database(path.join(__dirname, '../../opalite.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => console.error);
    initTables();
}

function initTables() {
    //Create all tables from tables.json
    tables.forEach(table => {
        let sql = `CREATE TABLE IF NOT EXISTS ${table.name}(`;
        table.columns.forEach(column => {
            sql += `${column.name} ${column.type},`;
        });

        sql = sql.substr(0, sql.length - 1); //to remove ',' at end
        sql += `)`;

        db.run(sql);
    });
}