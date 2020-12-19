import { addCredits, db, getUser } from "./database";

export const subscriptionsLength = 30 * 24 * 60 * 60;
const inactivePeriod = 2 * 24 * 60 * 60;

export async function checkSubscriptionsForUser(user: string) {
    db.all("SELECT * FROM products WHERE owner=?", [user], (err, rows) => {
        rows.forEach(row => {
            checkSubscription(row);
        });
    });
}

async function checkSubscription(subscription) {
    const currTimestamp = Math.floor(Date.now() / 1000);

    if (subscription.status != "cancelled") {
        if (subscription.nextDue <= currTimestamp) { // 30+ days after last renew
            deactivateSub(subscription); // deactivate product ('delete') if not already
        } else if (subscription.nextDue <= currTimestamp + inactivePeriod) { // 28 - 30 days after last renew
            getUser(subscription.owner, user => {
                if (user.credits >= 500) {
                    renewSub(subscription); // deduct credits and renew duedate; unsuspend if necessary
                } else {
                    suspendSub(subscription); // suspend product if not already
                }
            });
        }
    }
}

function deactivateSub(subscription) {
    if (subscription.state != "inactive") {
        db.run("UPDATE products SET state=? WHERE uid=?", ["inactive", subscription.uid]);
        console.log("deactivating product " + subscription.uid); // TODO : deactive
    }
} 

function renewSub(subscription) {
    const currTimestamp = Math.floor(Date.now() / 1000);

    addCredits(subscription.owner, -500);
    db.run("UPDATE products SET nextDue=? WHERE uid=?", [currTimestamp + subscriptionsLength, subscription.uid]);
    console.log("renewed subscription with uid " + subscription.uid);
    if (subscription.state == "suspended") {
        console.log("reactivating (unsuspending) product" + subscription.uid); // TODO : set config.php -> active
        db.run("UPDATE products SET state=? WHERE uid=?", ["active", subscription.uid]);
    }
}

function suspendSub(subscription) {
    if (subscription.state != "suspended") {
        console.log("suspending product " + subscription.uid); // TODO : set config.php -> suspended
        db.run("UPDATE products SET state=? WHERE uid=?", ["suspended", subscription.uid]);
    }
}

export async function checkSubscriptions() {
    db.all("SELECT * FROM products", (err, rows) => {
        rows.forEach(row => {
            checkSubscription(row);
        });
    });
}
