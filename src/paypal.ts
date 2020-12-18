import paypal from "paypal-rest-sdk";
import fetch from "node-fetch";
import btoa from "btoa";

const config = require("../opalite.json");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.paypal_id,
    'client_secret': config.paypal_secret
});

export function initPayment(req, res) {
    if (!req.session["user"]) {
        res.send("not logged in.");
        return;
    }

    //build PayPal payment request
    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url' : 'http://localhost/process?discord=' + req.session["user"],
            'cancel_url' : 'http://localhost/cancel'
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total':req.query.amount,
                'currency':'USD'
            },
            'description':'This is the payment transaction description.'
        }]
    });

    paypal.payment.create(payReq, function(error, payment){
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
                        res.send('You payed ' + response.purchase_units[0].amount.value + " with account " + req.query.discord);
                    } else {
                        res.send("not completed");
                    }
                });
            } else {
                res.send('payment not successful');
            }
        }
    });
}