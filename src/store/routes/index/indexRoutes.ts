export async function handleIndex(req, res) {
    res.render("../templates/index.ejs", { isLoggedIn: req.session["user"] });
}