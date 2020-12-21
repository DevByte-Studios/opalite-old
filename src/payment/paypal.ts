import paypal from "paypal-rest-sdk";
import fetch from "node-fetch";
import btoa from "btoa";
import { claimPayment, isPaymentClaimed } from "./paymentDbUtils";
import { modifyCredits } from "../accounts/accountDbUtils";
import { checkSubscriptionsForUser } from "../subscription/subscription";
import { routes } from "../express/router";

const config = require("../../opalite.json");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.paypal_id,
    'client_secret': config.paypal_secret
});

const packages = [
    {
        credits: 500,
        price: 4.99
    },
    {
        credits: 1000,
        price: 9.99
    },
    {
        credits: 5000,
        price: 44.99
    },
    {
        credits: 10000,
        price: 79.99
    }
]

export function initPayment(req, res) {
    if (!req.session["user"]) {
        res.redirect("/");
        return;
    }
    if (!req.query.credits) {
        res.redirect("/");
        return;
    }

    let price = 0;
    packages.forEach(pack => {
        if (pack.credits == req.query.credits) {
            price = pack.price;
        }
    });

    if (price == 0)
        res.redirect("/");

    //build PayPal payment request
    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url' : 'http://localhost' + routes.paypalProcess.url + '?uid=' + req.session["user"],
            'cancel_url': 'http://localhost' + routes.dashboard.url
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total' : price,
                'currency' : 'USD',
            },
            'description' : `Updating users virtual balance (+${req.query.credits})`
        }]
    });

    paypal.payment.create(payReq, function(error, payment) {
        if(error){
            console.error(error);
        } else {
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })
        
            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')){
                res.redirect(links['approval_url'].href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });
}

export function processPayment(req, res) {
    if (!req.query.paymentId) {
        res.redirect("/");
        return;
    }
    if (!req.query.PayerID) {
        res.redirect("/");
        return;
    }
    if (!req.query.token) {
        res.redirect("/");
        return;
    }

    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment) {
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved') {

                let token = req.query.token.substr(3);

                fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${token}`, {headers: {"Authorization": `Basic ${btoa(config.paypal_id + ":" + config.paypal_secret)}`}})
                .then(res => res.json())
                .then(response => {
                    if (response.status == 'COMPLETED') {
                        isPaymentClaimed(req.query.paymentId, () => {
                            claimPayment(req.query.paymentId, req.query.uid);

                            let credits = 0;
                            packages.forEach(pack => {
                                if (pack.price == response.purchase_units[0].amount.value)
                                    credits = pack.credits;
                            });
                            if (credits == 0)
                                credits = response.purchase_units[0].amount.value * 100;

                            modifyCredits(req.query.uid, credits);
                            
                            checkSubscriptionsForUser(req.query.uid);
                        });
                        res.redirect("/dashboard");
                    } else {
                        res.redirect("/dashboard");
                    }
                });
            } else {
                res.redirect("/dashboard");
            }
        }
    });
}