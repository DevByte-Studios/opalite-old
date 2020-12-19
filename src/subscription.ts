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
        if (subscription.nextDue <= currTimestamp) {
            getUser(subscription.owner, user => {
                if (user.credits >= 500) {
                    addCredits(subscription.owner, -500);
                    db.run("UPDATE products SET nextDue=? WHERE uid=?", [currTimestamp + subscriptionsLength, subscription.uid]);
                    console.log("renewed subscription with uid " + subscription.uid);
                    if (subscription.state == "inactive" || subscription.state == "suspended") {
                        console.log("reactivating product" + subscription.uid); // TODO : set config.php -> active
                        db.run("UPDATE products SET state=? WHERE uid=?", ["active", subscription.uid]);
                    }
                } else {
                    if (subscription.state != "inactive") {
                        db.run("UPDATE products SET state=? WHERE uid=?", ["inactive", subscription.uid]);
                        console.log("deactivating product " + subscription.uid); // TODO : deactive
                    }
                }
            });
        } else if (subscription.nextDue <= currTimestamp + inactivePeriod) {
            getUser(subscription.owner, user => {
                if (user.credits < 500) { // CHECK FOR ALL SUBSCRIPTIONs
                    if (subscription.state == "active") {
                        console.log("suspending product " + subscription.uid); // TODO :  suspend
                        db.run("UPDATE products SET state=? WHERE uid=?", ["suspended", subscription.uid]);
                    }
                } else {
                    if (subscription.state == "suspended") {
                        console.log("reactivating the product " + subscription.uid);
                        db.run("UPDATE products SET state=? WHERE uid=?", ["active", subscription.uid]);
                    }
                }
            });
        }
    }
}

export async function checkSubscriptions() {
    db.all("SELECT * FROM products", (err, rows) => {
        rows.forEach(row => {
            checkSubscription(row);
        });
    });
}
