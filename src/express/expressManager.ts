import express from "express";
import ExpressSession from "express-session";
import path from "path";
import { addRoutes } from "./router";

export async function init() {
    const app = express();

    setAppDefaults(app);
    addRoutes(app);

    app.listen(80, console.error);
}

function setAppDefaults(app) {
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "../../public")));

    app.use(ExpressSession({
        secret: "k2L0av3j",
        resave: false,
        saveUninitialized: true
    }));
}