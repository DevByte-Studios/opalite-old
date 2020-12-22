import express from "express";
import ExpressSession from "express-session";
import path from "path";
import { authorize, loginRedirect } from "../accounts/oauth";
import { initPayment, processPayment } from "../payment/paypal";
import { buyProcess } from "../store/store";
import { handleAdmin } from "./admin/adminRoutes";
import { handleDashboard, handleDashboardContent, handleSignout } from "./dashboard/dashboardRoutes";
import { handleIndex } from "./index/indexRoutes";


const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

export const routes = {
  homepage: {
      url: "/",
      destination: handleIndex
  },
  dashboard: {
      url: "/dashboard",
      destination: handleDashboard
  },
  adminDashboard:  {
      url: "/admin",
      destination: handleAdmin
  },
  loginRedirect:  {
      url: "/login",
      destination: loginRedirect
  },
  signoutProcess:  {
      url: "/signout",
      destination: handleSignout
  },
  processLogin: {
      url: "/oauth2/authorize",
      destination: authorize
  },
  processCreditPurchase: {
      url: "/purchase/credits",
      destination: initPayment
  },
  paypalProcess: {
      url: "/paypal/process",
      destination: processPayment
  },
  processProductPurchase: {
      url: "/purchase/product",
      destination: buyProcess
  },
  dashboardContent: {
      url: "/dashboard/*",
      destination: handleDashboardContent
  }
};

export async function init() {
    const app = express();

    setAppDefaults(app);
    addRoutes(app);

    app.listen(544, console.error);
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