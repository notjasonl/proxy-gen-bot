const embeds = require('../embeds');
const config = require('../../config/config.json')

const { MessageAttachment, Message } = require('discord.js')

const fetch = require('node-fetch');

const proxiwareHeaders = {
    "Content-Type": "application/json",
    "X-API-Key": config.proxiwareAPI
}

const proxiwareRoot = config.proxiwareRoot

module.exports = (msg, args, db) => {
    const usersColl = db.collection("users");

    let userID = msg.author.id;
    let gatewayID;
    let num;

    if (args.length != 0) {
        msg.channel.send({ embed: embeds.incorrectArgs });
        return;
    }
    usersColl.find({ userID: userID }).toArray().then(userData => {
        if (userData.length == 0) return;
        let countries = []
        let ids = []
        fetch(proxiwareRoot + "gateways/list", {
            method: 'get',
            headers: proxiwareHeaders
        }).then(res => {
            return res.json();
        }).catch(err => {
            console.log(err)
            msg.channel.send({ embed: embeds.errors.shopifyAuthError })
            return;
        })
        .then(gateways => {
            gateways.forEach(gateway => {
                countries.push(gateway.name.trim());
                ids.push(gateway.id)
            })
            msg.channel.send({ embed: embeds.prompts.proxyCountry(countries) });
            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                { max: 1, time: 30000 }).then(collected => {     
                    let country = collected.first().content           
                    if (!countries.includes(country)) {
                        msg.channel.send({ embed: embeds.errors.countryNotFound })
                        return;
                    }
                    
                    gatewayID = ids[countries.indexOf(country)]

                    msg.channel.send({ embed: embeds.prompts.proxyType });
                    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                        { max: 1, time: 30000 }).then(collected => {
                            let type = collected.first().content.toLowerCase()

                            if (type != 'sticky' && type != 'rotating') {
                                msg.channel.send({ embed: embeds.errors.proxyTypeNotFound })
                                return;
                            }
                            msg.channel.send({ embed: embeds.prompts.numProxies });
                            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                                { max: 1, time: 30000 }).then(collected => {
                                    try {
                                        num = parseInt(collected.first().content);
                                    } catch (err) {
                                        msg.channel.send({ embed: embeds.notNum });
                                        console.log(err);
                                        return;
                                    }

                                    let generateBody = JSON.stringify({
                                        "id": parseInt(gatewayID),
                                        "type": type,
                                        "amount": num,
                                        "random": true
                                    })

                                    fetch(proxiwareRoot + "gateway/generate", {
                                        method: 'post',
                                        headers: proxiwareHeaders,
                                        body: generateBody
                                    }).then(res => {
                                        return res.json();
                                    }).catch(err => {
                                        console.log(err)
                                        msg.channel.send({ embed: embeds.errors.shopifyAuthError })
                                        return;
                                    })
                                    .then(json => {
                                        let text = ""
                                        json.forEach(proxy => {
                                            text += proxy + "\n"
                                        })
                                        let fileData = new Buffer.from(text, 'utf-8')
                                        let attachment = new MessageAttachment(fileData, 'proxies.txt')
                                        
                                        msg.channel.send({ embed: embeds.generateSuccess(country, type, num) })
                                        msg.channel.send({ files: [attachment] })
                                    })
                                })
                        })
                }).catch((err) => {
                    console.log(err)
                    msg.channel.send({ embed: embeds.noAnswer })
                })
        })
    })
    

    
}