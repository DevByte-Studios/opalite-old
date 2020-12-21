import { authorize, loginRedirect } from "../accounts/oauth";
import { initPayment, processPayment } from "../payment/paypal";
import { buyProcess } from "../store";
import { handleAdmin } from "./admin/adminRoutes";
import { handleDashboard, handleDashboardContent, handleSignout } from "./dashboard/dashboardRoutes";
import { handleIndex } from "./index/indexRoutes";

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

export async function addRoutes(app) {
    Object.keys(routes).forEach((routeIndex) => {
        let route = routes[routeIndex];
        let method = route.method || "get";

        app[method](route.url, route.destination);
    })
}