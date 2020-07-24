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

    let userID = msg.author.id;

    usersColl.find({ userID: userID }).toArray().then(userData => {
        if (userData.length == 0) {
            msg.channel.send({ embed: embeds.userNotFound })
            return;
        }

        let proxiwareID = userData[0].proxiwareUserID;
        let dataBody = JSON.stringify({
            "user_id": proxiwareID
        })

        fetch(proxiwareRoot + "user/info", {
            method: 'post',
            headers: proxiwareHeaders,
            body: dataBody
        }).then(res => {
            return res.json()
        }).catch(err => {
            msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
            return
        })
        .then(json => {
            let data = (parseInt(json.data) / 1000000000).toFixed(2)
            
            usersColl.updateOne(
                { userID: userID },
                { 
                    $set: {
                        data: data
                    }
                }, (err, data) => {
                    if (err) console.log(err)
                    console.log(data)
            })

            let startingData = userData[0].startingData
            let used = startingData - data;
            let percent = (used / startingData).toFixed(2) + "%"
            

            msg.channel.send({ embed: embeds.getData(used, startingData, percent) });
        })
    })
}