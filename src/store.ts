import { simpleflake } from "simpleflakes";
import * as db from "./database";
import { subscriptionsLength } from "./subscription";

export async function buyProcess(req, res) {
    if (req.session["user"]) {
        db.getUser(req.session["user"], (user) => {
            if (user.credits >= 500) {
                db.addCredits(user.uid, -500);
                const flake = simpleflake().toString(36) + "";
                let currDate = Math.floor(Date.now() / 1000);
                db.db.run("INSERT INTO products (uid, owner, initiatedAt, nextDue, state, notified) VALUES (?, ?, ?, ?, ?, ß)", [flake, user.uid, currDate, currDate + subscriptionsLength, "active", 0]);
                console.log("activated product");
                res.redirect("/dashboard");
            }
        });
    } else
        res.redirect("/login");
}