import mysql from "mysql";

const config = require("../../../opalite.json");

import { tables } from "./tables.json";
export var db: mysql.Connection;

export async function init() {
    db = mysql.createConnection({
        host     : 'db.hexaneweb.com',
        user     : 'polited1_storedb',
        password : 'WxUXh3NL#PlL',
        database : 'polited1_storedb'
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