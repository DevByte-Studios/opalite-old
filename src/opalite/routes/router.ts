import express from "express";
import ExpressSession from "express-session";
import path from "path";
import { authorize, loginRedirect } from "../accounts/oauth";
import { handleAdmin } from "./admin/adminRoutes";
import { handleIndex } from "./index/indexRoutes";

var app;

export const routes = {
  homepage: {
    url: "/",
    destination: handleIndex
  },
  adminDashboard: {
    url: "/admin",
    destination: handleAdmin
  },
  loginRedirect:  {
      url: "/login",
      destination: loginRedirect
  },
  processLogin: {
      url: "/oauth2/authorize",
      destination: authorize
  }
};

export function init() {
  const app = express();

  setAppDefaults(app);
  addRoutes(app);

  app.listen(543, console.error);
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

export async function addRoutes(app) {
  Object.keys(routes).forEach((routeIndex) => {
    let route = routes[routeIndex];
    let method = route.method || "get";

    app[method](route.url, route.destination);
  })
}