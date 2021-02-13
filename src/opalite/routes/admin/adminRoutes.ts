import { getUser } from "../../accounts/accountDbUtils";

export async function handleAdmin(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user) => {
            if (user.permission_level == 0) {
                res.redirect("/dashboard");
            } else {
                res.render("../templates/opalite/admin/admin.ejs", {});
            }
        });
    } else
        res.redirect("/login");
}