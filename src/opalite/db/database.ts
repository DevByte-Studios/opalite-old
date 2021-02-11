import mysql from "mysql";

const config = require("../../../opalite.json");

import { tables } from "./tables.json";
export var db: mysql.Connection;

export async function init() {
    db = mysql.createConnection({
        host: '135.181.193.99',
        user: 'remote',
        password: 'RL2fzm2mMFYgu8tk',
        database: 'opalite_product'
    });

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

        db.query(sql);
    });
}