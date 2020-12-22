export async function handleIndex(req, res) {
    res.render("../templates/store/index.ejs", { isLoggedIn: req.session["user"] });
}