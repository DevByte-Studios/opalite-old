import { getUser } from "../../accounts/accountDbUtils";

function checkPermission(req, res): boolean {
    if (!req.session["user"])
        return false;
    
    return true;
} 

export async function handleDashboardContent(req, res) {
    if (!checkPermission(req, res)) {
        res.redirect("/");
        return;
    }

    let file = (req.url + "").split("/")[2];
    getUser(req.session["user"], (user) => {
        res.render(`../templates/store/dashboard/${file}-content.ejs`, {
            user,
            discord: req.session["discord-info"]
        });
    });
}

export async function handleSignout(req, res) {
    req.session.destroy(() => { });
    res.redirect("/");
}

export async function handleDashboard(req, res) {
    if (checkPermission(req, res))
        res.render("../templates/store/dashboard.ejs");
    else
        res.redirect("/login");
}