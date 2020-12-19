import express from "express";
import ExpressSession from "express-session";
import { authorize } from "./oauth";
import path from "path";
import { initPayment, processPayment } from "./paypal";
import * as db from "./database";
import { checkSubscriptions, subscriptionsLength } from "./subscription";
import { buyProcess } from "./store";

const config = require("../opalite.json");

db.init();

setTimeout(() => {
    checkSubscriptions();
}, 100)

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.use(ExpressSession({
    secret: "k2L0av3j",
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    res.render("../templates/index.ejs");
});

app.get("/dashboard", (req, res) => {
    if (req.session["user"]) {
        db.getUser(req.session["user"], (user) => {
            if (user.permission == 0) {
                db.db.all("SELECT * FROM products WHERE owner=?", [user.uid], (err, rows) => {
                    res.render("../templates/dashboard.ejs", {user: user, products: rows});
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
        db.getUser(req.session["user"], (user) => {
            if (user.permission == 0) {
                res.redirect("/dashboard");
            } else {
                res.render("../templates/admin.ejs", {});
            }
        });
    } else
        res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=789165139378044938&redirect_uri=http%3A%2F%2Flocalhost%2Fauthorize&response_type=code&scope=identify");
});

app.get("/authorize", (req, res) => {
    authorize(config, req, res);
});

app.get('/create', function(req, res) {
    initPayment(req, res);
});

app.get('/process', function(req, res) {
    processPayment(req, res);
});

app.get("/buy", (req, res) => {
    buyProcess(req, res);
});

app.listen(80, console.error);