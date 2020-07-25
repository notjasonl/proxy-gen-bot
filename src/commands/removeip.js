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

    const ipRE = /^(([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)$/

    
    usersColl.find({ userID: msg.author.id }).toArray().then(userData => {
        if (userData.length == 0) {
            msg.channel.send({ embed: embeds.userNotFound })
            return;
        }
        msg.channel.send({ embed: embeds.prompts.removeIP })
        msg.channel.awaitMessages(m => m.author.id == msg.author.id,
            { max: 1, time: 60000 }).then(collected => {
                if (collected.first().content.trim().toLowerCase() == 'cancel') {
                    msg.channel.send({ embed: embeds.cancelled });
                    return;
                }
                if (!ipRE.test(collected.first().content)) {
                    msg.channel.send({ embed: embeds.invalidIP })
                    return
                }
    
                pubIP = collected.first().content;
                let proxiwareID = userData[0].proxiwareUserID;

                let removeBody = JSON.stringify({
                    "user_id": proxiwareID,
                    "addr": pubIP
                })

                fetch(proxiwareRoot + "user/binds/unbind", {
                    method: 'post',
                    headers: proxiwareHeaders,
                    body: removeBody
                }).then(res => {
                    return res.json()
                }).catch(err => {
                    msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
                })
                .then(json => {
                    if (json.error != null) {
                        msg.channel.send({ embed: embeds.errors.addressNotFound })
                    } else {
                        msg.channel.send({ embed: embeds.ipRemoved(pubIP) })
                    }
                })
            }).catch((err) => {
                console.log(err)
                msg.channel.send({ embed: embeds.noAnswer })
            })
        })
}