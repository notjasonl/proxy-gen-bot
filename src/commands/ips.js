const embeds = require('../embeds');
const config = require('../../config/config.json')

const fetch = require('node-fetch');

const proxiwareRoot = config.proxiwareRoot

const proxiwareHeaders = {
    "Content-Type": "application/json",
    "X-API-Key": config.proxiwareAPI
}

module.exports = (msg, args, db) => {
    const usersColl = db.collection("users");

    usersColl.find({ userID: msg.author.id }).toArray().then(userData => {
        if (userData.length == 0) {
            msg.channel.send({ embed: embeds.userNotFound })
            return;
        }

        let proxiwareUserID = userData[0].proxiwareUserID;

        let findBody = JSON.stringify({
            "user_id": proxiwareUserID
        })

        fetch(proxiwareRoot + "user/info", {
            method: 'post',
            headers: proxiwareHeaders,
            body: findBody
        }).then(res => {
            return res.json()
        }).catch(err => {
            msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
        })
        .then(json => {
            let binds = json.binds;
            if (binds.length == 0) {
                msg.channel.send({ embed: embeds.errors.noIPs })
            } else {
                msg.channel.send({ embed: embeds.showIPs(binds) })
            }
        })
    })
}