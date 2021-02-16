import { modifyCredits } from "../accounts/accountDbUtils";
import { db } from "../db/database";
import { notifyPrior } from "../discordBot/discordBot";
import { subscriptionsLength } from "./subscription";
import { simpleflake } from "simpleflakes";
import { tables } from "./tables_product.json";

export function deactivateSub(subscription) {
    if (subscription.state != "inactive") {
        db.query("UPDATE products SET state=? WHERE uid=?", ["inactive", subscription.uid]);
        console.log("deactivating product " + subscription.uid); // TODO : deactive
    }
}

export function renewSub(subscription) {
    const currTimestamp = Math.floor(Date.now() / 1000);

    modifyCredits(subscription.owner, -500);
    db.query("UPDATE products SET nextDue=? notified=0 WHERE uid=?", [currTimestamp + subscriptionsLength, subscription.uid]);
    console.log("renewed subscription with uid " + subscription.uid);
    if (subscription.state == "suspended") {
        console.log("reactivating (unsuspending) product" + subscription.uid); // TODO : set config.php -> active
        db.query("UPDATE products SET state=? WHERE uid=?", ["active", subscription.uid]);
    }
}

export function createSub(user) {
    const flake = simpleflake().toString(36) + "";
    let currDate = Math.floor(Date.now() / 1000);
    db.query("INSERT INTO products (uid, owner, initiatedAt, nextDue, state, notified) VALUES (?, ?, ?, ?, ?, ?)", [flake, user.uid, currDate, currDate + subscriptionsLength, "active", 0]);
    db.query("USE opalite_product");
    initTablesForSub(flake);
    db.query("USE opalite");
    console.log("created product");
}

function initTablesForSub(prefix) {
    //Create all tables from tables_product.json
    tables.forEach(table => {
        let sql = `CREATE TABLE IF NOT EXISTS ${prefix + "_" + table.name}(`;
        table.columns.forEach(column => {
            sql += `${column.name} ${column.type},`;
        });

        sql = sql.substr(0, sql.length - 1); //to remove ',' at end
        sql += `)`;

        db.query(sql);
    });
}

export function notify(subscription) {
    if (subscription.notified == 0) {
        db.query("SELECT * FROM users WHERE uid=?", [subscription.owner], (error, results, fields) => {
            if (results[0].credits < 500) { // TODO: Check for all other subs
                db.query("UPDATE products SET notified=1 WHERE uid=?", [subscription.uid]);
                notifyPrior(results[0].discord);
            }
        });
    }
}

export function suspendSub(subscription) {
    if (subscription.state != "suspended") {
        console.log("suspending product " + subscription.uid); // TODO : set config.php -> suspended
        db.query("UPDATE products SET state=? WHERE uid=?", ["suspended", subscription.uid]);
    }
}