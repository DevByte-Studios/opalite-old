import mysql from "mysql";

const config = require("../../../opalite.json");

//import { tables } from "./tables.json";
export var db: mysql.Connection;

export async function init() {
    db = mysql.createConnection({
        host: '135.181.193.99',
        user: 'remote',
        password: 'RL2fzm2mMFYgu8tk',
        database: 'opalite_product'
    });

}