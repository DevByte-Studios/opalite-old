import fetch from "node-fetch";
import { URLSearchParams } from "url"
import { discordRegister } from "./accountDbUtils";

const config = require("../../../opalite.json");

export function authorize(req, res) {
    let params = new URLSearchParams();
    params.append("client_id", config.clientId);
    params.append("client_secret", config.secret);
    params.append("code", req.query.code + "");
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", "http://localhost/oauth2/authorize");

    fetch("https://discord.com/api/oauth2/token", {method: 'post', body: params})
    .then(res => res.json())
        .then(response => {
        fetch("https://discord.com/api/users/@me", {headers: {"Authorization": `Bearer ${response.access_token}`}})
        .then(res => res.json())
            .then(dcResponse => {
                if (!dcResponse.id) {
                    res.redirect("/");
                    return;
                }
                discordRegister(dcResponse.id + "", (id, permission) => {
                    req.session["user"] = id;
                    req.session["discord-info"] = dcResponse;
                    req.session["permission"] = permission;

                    if (req.query.redirect)
                        res.redirect(req.query.redirect);
                    else
                        res.redirect("/dashboard");
                });
        });
    });
}

export async function loginRedirect(req, res) {
    let redirectUrl = "http://localhost/oauth2/authorize";
    if (req.query.redirect)
        redirectUrl += "?redirect=" + req.query.redirect;
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=789165139378044938&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=identify`);
}