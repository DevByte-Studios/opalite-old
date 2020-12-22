import { getUser } from "../../accounts/accountDbUtils";
import { routes } from "../../../express/router";

export async function handleAdmin(req, res) {
    if (req.session["user"]) {
        getUser(req.session["user"], (user) => {
            if (user.permission == 0) {
                res.redirect("/dashboard");
            } else {
                res.render("../templates/store/admin/admin.ejs", {});
            }
        });
    } else
        res.redirect(routes.loginRedirect.url);
}