import { authorize, loginRedirect } from "../store/accounts/oauth";
import { initPayment, processPayment } from "../store/payment/paypal";
import { buyProcess } from "../store/store";
import { handleAdmin } from "../store/routes/admin/adminRoutes";
import { handleDashboard, handleDashboardContent, handleSignout } from "../store/routes/dashboard/dashboardRoutes";
import { handleIndex } from "../store/routes/index/indexRoutes";


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
    },
    notFound: {
        url: "*",
        destination: handleNotFound
    }
};

export async function addRoutes(app) {
    Object.keys(routes).forEach((routeIndex) => {
        let route = routes[routeIndex];
        let method = route.method || "get";

        app[method](route.url, route.destination);
    })
}

export async function handleNotFound(req, res) {
    res.status(404).render("../templates/notFound.ejs");
}