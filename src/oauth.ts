import fetch from "node-fetch";
import { discordRegister } from "./database";

export function authorize(config, req, res) {
    let params = new URLSearchParams();
    params.append("client_id", config.clientId);
    params.append("client_secret", config.secret);
    params.append("code", req.query.code + "");
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", "http://localhost/authorize");

    fetch("https://discord.com/api/oauth2/token", {method: 'post', body: params})
    .then(res => res.json())
    .then(response => {
        fetch("https://discord.com/api/users/@me", {headers: {"Authorization": `Bearer ${response.access_token}`}})
        .then(res => res.json())
        .then(response => {
            discordRegister(response.id + "", (id, permission) => {
                req.session["user"] = id;
                req.session["permission"] = permission;
                res.redirect("/");
            });
        });
    });
}