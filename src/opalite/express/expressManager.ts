import express from "express";
import ExpressSession from "express-session";
import path from "path";

var app;

export function init() {
  app = express();

  setAppDefaults(app);

  app.listen(543);

  app.get("/", (req, res) => res.send("heiii"));
}

function setAppDefaults(app) {
  app.set("view engine", "ejs");
  app.use(express.static(path.join(__dirname, "../../../public")));

  app.use(ExpressSession({
      secret: "k2L0av3j",
      resave: false,
      saveUninitialized: true
  }));
}