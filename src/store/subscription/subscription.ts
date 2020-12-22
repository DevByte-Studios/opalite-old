import { getUser } from "../accounts/accountDbUtils";
import { db } from "../database";
import { deactivateSub, notify, renewSub, suspendSub } from "./subscriptionUtils";

export const subscriptionsLength = 30 * 24 * 60 * 60;
const inactivePeriod = 2 * 24 * 60 * 60;
const notifyPeriod = 10 * 24 * 60 * 60;

export async function checkSubscriptionsForUser(user: string) {
    db.all("SELECT * FROM products WHERE owner=?", [user], (err, rows) => {
        rows.forEach(row => {
            checkSubscription(row);
        });
    });
}

async function checkSubscription(subscription): Promise<void> {
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
        } else if (subscription.nextDue <= currTimestamp + notifyPeriod) {
            notify(subscription);
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