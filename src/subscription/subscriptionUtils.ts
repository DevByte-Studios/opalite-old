import { modifyCredits } from "../accounts/accountDbUtils";
import { db } from "../database";
import { notifyPrior } from "../discordBot";
import { subscriptionsLength } from "./subscription";

export function deactivateSub(subscription) {
    if (subscription.state != "inactive") {
        db.run("UPDATE products SET state=? WHERE uid=?", ["inactive", subscription.uid]);
        console.log("deactivating product " + subscription.uid); // TODO : deactive
    }
}

export function renewSub(subscription) {
    const currTimestamp = Math.floor(Date.now() / 1000);

    modifyCredits(subscription.owner, -500);
    db.run("UPDATE products SET nextDue=? notified=0 WHERE uid=?", [currTimestamp + subscriptionsLength, subscription.uid]);
    console.log("renewed subscription with uid " + subscription.uid);
    if (subscription.state == "suspended") {
        console.log("reactivating (unsuspending) product" + subscription.uid); // TODO : set config.php -> active
        db.run("UPDATE products SET state=? WHERE uid=?", ["active", subscription.uid]);
    }
}

export function notify(subscription) {
    if (subscription.notified == 0) {
        db.get("SELECT * FROM users WHERE uid=?", [subscription.owner], (err, row) => {
            if (row.credits < 500) { // TODO: Check for all other subs
                db.run("UPDATE products SET notified=1 WHERE uid=?", [subscription.uid]);
                notifyPrior(row.discord);
            }
        });
    }
}

export function suspendSub(subscription) {
    if (subscription.state != "suspended") {
        console.log("suspending product " + subscription.uid); // TODO : set config.php -> suspended
        db.run("UPDATE products SET state=? WHERE uid=?", ["suspended", subscription.uid]);
    }
}