import express from "express";
import ExpressSession from "express-session";
import { authorize } from "../accounts/oauth";
import path from "path";
import { initPayment, processPayment } from "../payment/paypal";
import * as db from "../database";
import { buyProcess } from "../store";
import { getUser } from "../accounts/accountDbUtils";

const config = require("../../opalite.json");

export async function init() {
    const app = express();
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "../../public")));

    app.use(ExpressSession({
        secret: "k2L0av3j",
        resave: false,
        saveUninitialized: true
    }));

    app.get("/", (req, res) => {
        let isLoggedIn = false;
        if (req.session["user"])
            isLoggedIn = true;
        res.render("../templates/index.ejs", { isLoggedIn });
    });
    
    app.get("/dashboard", (req, res) => {
        if (req.session["user"]) {
            getUser(req.session["user"], (user) => {
                if (user.permission == 0) {
                    db.db.all("SELECT * FROM products WHERE owner=?", [user.uid], (err, rows) => {
                        res.render("../templates/dashboard.ejs", {user: user, products: rows, discord: req.session["discord-info"]});
                    })
                } else {
                    res.render("../templates/admin.ejs", {});
                }
            });
        } else
            res.redirect("/login");
    });
    
    app.get("/admin", (req, res) => {
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
    });
    
    app.get("/login", (req, res) => {
        let redirectUrl = "http://localhost/oauth2/authorize";
        if (req.query.redirect)
            redirectUrl += "?redirect=" + req.query.redirect;
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=789165139378044938&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=identify`);
    });
    
    app.get("/signout", (req, res) => {
        req.session.destroy(() => { });
        res.redirect("/");
    });
    
    app.get("/oauth2/authorize", (req, res) => {
        authorize(config, req, res);
    });
    
    app.get('/buyCredits', function(req, res) {
        initPayment(req, res);
    });
    
    app.get('/process', function(req, res) {
        processPayment(req, res);
    });
    
    app.get("/buyProduct", (req, res) => {
        buyProcess(req, res);
    });
    
    app.listen(80, console.error);
}