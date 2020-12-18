import express from "express";
import ExpressSession from "express-session";
import { authorize } from "./oauth";
import path from "path";


const config = require("../opalite.json");

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
        res.send(`<img src="${req.session["avatar"] + "?size=128"}">`)
    } else
        res.render("../templates/index.ejs");
});

app.get("/login", (req, res) => {
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=789165139378044938&redirect_uri=http%3A%2F%2Flocalhost%2Fauthorize&response_type=code&scope=identify");
});

app.get("/authorize", (req, res) => {
    authorize(config, req, res);
});

app.listen(80, console.error);
