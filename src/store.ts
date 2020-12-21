import { simpleflake } from "simpleflakes";
import { getUser, modifyCredits } from "./accounts/accountDbUtils";
import { db } from "./database";
import { routes } from "./express/router";
import { subscriptionsLength } from "./subscription/subscription";

export async function buyProcess(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user): void => {
            if (user.credits >= 500) {
                modifyCredits(user.uid, -500);
                const flake = simpleflake().toString(36) + "";
                let currDate = Math.floor(Date.now() / 1000);
                db.run("INSERT INTO products (uid, owner, initiatedAt, nextDue, state, notified) VALUES (?, ?, ?, ?, ?, ?)", [flake, user.uid, currDate, currDate + subscriptionsLength, "active", 0]);
                console.log("activated product");
                res.redirect(routes.dashboard);
            }
        });
    } else
        res.redirect(routes.loginRedirect.url);
}