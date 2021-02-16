import { simpleflake } from "simpleflakes";
import { getUser, modifyCredits } from "../accounts/accountDbUtils";
import { db } from "../db/database";
import { subscriptionsLength } from "../subscription/subscription";
import { createSub } from "../subscription/subscriptionUtils";

export async function buyProcess(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user): void => {
            if (user.credits >= 500) {
                modifyCredits(user.uid, -500);
                createSub(user);
                res.redirect("/dashboard");
            }
        });
    } else
        res.redirect("/login");
}