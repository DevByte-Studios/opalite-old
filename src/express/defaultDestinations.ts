import { getUser } from "../accounts/accountDbUtils";
import { db } from "../database";

export async function handleDashboard(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user) => {
            if (user.permission == 0) {
                db.all("SELECT * FROM products WHERE owner=?", [user.uid], (err, rows) => {
                    res.render("../templates/dashboard.ejs", { user: user, products: rows, discord: req.session["discord-info"] });
                })
            } else {
                res.render("../templates/admin.ejs", {});
            }
        });
    } else
        res.redirect("/login");
}

export async function handleIndex(req, res) {
    res.render("../templates/index.ejs", { isLoggedIn: req.session["user"] });
}

export async function handleSignout(req, res) {
    req.session.destroy(() => { });
    res.redirect("/");
}

export async function handleAdmin(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user) => {
            if (user.permission == 0) {
                res.redirect("/dashboard");
            } else {
                res.render("../templates/admin/admin.ejs", {});
            }
        });
    } else
        res.redirect("/login");
}

export async function handleDashboardContent(req, res) {
    if (!req.session["user"]) {
        req.redirect("/");
        return;
    }

    let file = (req.url + "").split("/")[2];
    getUser(req.session["user"], (user) => {
        res.render(`../templates/dashboard/${file}-content.ejs`, {
            user,
            discord: req.session["discord-info"]
        });
    });
}