import express from "express";
import ExpressSession from "express-session";
import { authorize } from "./oauth";
import path from "path";
import { initPayment, processPayment } from "./paypal";
import * as db from "./database";

const config = require("../opalite.json");

db.init();

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.use(ExpressSession({
    secret: "k2L0av3j",
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    if (req.session["user"]) {
        res.render("../templates/dashboard.ejs", {userId: req.session["user"]});
    } else
        res.render("../templates/index.ejs");
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

app.listen(80, console.error);
