const embeds = require('../embeds');
const config = require('../../config/config.json');
const variants = require('../variants.json');

const fetch = require('node-fetch');
const { Client } = require('discord.js');
const { gettingOrder } = require('../embeds');
const shopifyRoot = config.shopifyRoot
const proxiwareRoot = config.proxiwareRoot

const shopifyHeaders = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": config.shopifyPass
}

const proxiwareHeaders = {
    "Content-Type": "application/json",
    "X-API-Key": config.proxiwareAPI
}

const now = new Date();

const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ipRE = /^(([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)$/

module.exports = (msg, args, db) => {
    const keysColl = db.collection("keys");
    const usersColl = db.collection("users");
    const ordersColl = db.collection("orders");

    let email;
    let orderID;
    let pubIP;

    if (args.length != 0) {
        msg.channel.send({ embed: embeds.incorrectArgs });
        return;
    }

    msg.channel.send({ embed: embeds.prompts.shopifyEmail });
    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
        { max: 1, time: 30000 }).then(collected => {
            if (collected.first().content.toLowerCase() == 'cancel') {
                msg.channel.send({ embed: embeds.cancelled });
                return;
            }
            if (!emailRE.test(collected.first().content)) {
                msg.channel.send({ embed: embeds.invalidEmail })
                return
            }

            email = collected.first().content;

            msg.channel.send({ embed: embeds.prompts.shopifyOrder });
            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                { max: 1, time: 30000 }).then(collected => {
                    if (collected.first().content.toLowerCase() == 'cancel') {
                        msg.channel.send({ embed: embeds.cancelled });
                        return;
                    }
                    try {
                        orderID = parseInt(collected.first().content);
                    } catch (err) {
                        msg.channel.send({ embed: embeds.notNum });
                        console.log(err);
                        return;
                    }

                    msg.channel.send({ embed: embeds.gettingOrder })

                    let epochTime = Math.round(now.getTime() / 1000);
                    // database queries can go here
                    let username = msg.author.username + "#" + msg.author.discriminator;
                    let userID = msg.author.id

                    let order = {
                        email: email,
                        orderID: orderID,
                        claimedUser: username,
                        claimedID: userID,
                        claimedTime: epochTime
                    }

                    fetch(shopifyRoot + "orders.json?status=any&name=" + orderID, {
                        method: 'get',
                        headers: shopifyHeaders
                    })
                        .then(res => {
                           return res.json();
                        }).catch(err => {
                            console.log(err)
                            msg.channel.send({ embed: embeds.errors.shopifyAuthError })
                            return;
                        })
                    .then(json => {
                        if (json.orders.length == 0) {
                            msg.channel.send({ embed: embeds.noOrder })
                            return;
                        }
                        let orderEmail = json.orders[0].contact_email;

                        if (email != orderEmail) {
                            msg.channel.send({ embed: embeds.errors.emailMatchError })
                            return;
                        }

                        let addData = 0;
                        let items = json.orders[0].line_items;

                        items.forEach(item => {
                            addData += variants.resi[item.variant_id]
                        })
                        
                        ordersColl.find({ orderID: orderID }).toArray().then(orderData => {
                            let orders = [orderID]
                            if (orderData.length === 0) {
                                ordersColl.insertOne(order, (err, data) => {
                                        if (err) console.log(err)
                                        console.log(data)
                                })
                                usersColl.find({ userID: userID }).toArray().then(userData => {
                                    if (userData.length === 0) {
                                        let orders = [orderID]
                                                
                                        fetch(proxiwareRoot + "user/create", {
                                            method: 'get',
                                            headers: proxiwareHeaders
                                        }).then(res => {
                                            return res.json()
                                        }).catch(err => {
                                            console.log(err)
                                            msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
                                            return;
                                        })
                                        .then(json => {
                                            let proxiwareUID = json.user_id

                                            usersColl.insertOne(
                                                {
                                                    userID: userID,
                                                    proxiwareUserID: proxiwareUID,
                                                    email: email,
                                                    orders: orders,
                                                    startingData: addData,
                                                    data: addData
                                                }, (err, data) => {
                                                    if (err) console.log(err)
                                                    console.log(data)
                                            })
        
                                            let body = JSON.stringify({
                                                "user_id": json.user_id,
                                                "data_string": addData + "GB"
                                            })
        
                                            fetch(proxiwareRoot + "user/data/add", {
                                                method: 'post',
                                                headers: proxiwareHeaders,
                                                body: body
                                            }).then(res => {
                                                return res.json()
                                            }).catch(err => {
                                                console.log(err)
                                                msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
                                                return;
                                            })
                                            .then(json => {
                                                msg.channel.send({ embed: embeds.orderBoundSuccess(orderID, addData, addData) })
                                            })
                                        })
                                    } else {
                                        if (orderID in userData[0].orders) return;
                                        usersColl.updateOne(
                                            { userID: userID },
                                            { 
                                                $push: {
                                                    orders: orderID
                                                },
                                                $inc: {
                                                    data: addData
                                                }
                                            }, (err, data) => {
                                                if (err) console.log(err)
                                                console.log(data)
                                        })
        
                                        let body = JSON.stringify({
                                            "user_id": userData[0].proxiwareUserID,
                                            "data_string": addData.toString() + "GB"
                                        })
        
                                        fetch(proxiwareRoot + "user/data/add", {
                                            method: 'post',
                                            headers: proxiwareHeaders,
                                            body: body
                                        }).then(res => {
                                            return res.json()
                                        }).catch(err => {
                                            console.log(err)
                                            msg.channel.send({ embed: embeds.errors.proxiwareAuthError })
                                            return;
                                        })
                                        .then(json => {
                                            console.log(json)
                                            msg.channel.send({ embed: embeds.orderBoundSuccess(orderID, userData[0].data + addData, addData) })
                                        })
                                    }
                                })
                            } else {
                                msg.channel.send({ embed:embeds.errors.orderClaimed })
                                return;
                            }
                        })               
                    })
                }).catch((err) => {
                    console.log(err)
                    msg.channel.send({ embed: embeds.noAnswer })
                })

        }).catch(() => {
            msg.channel.send({ embed: embeds.noAnswer })
        })
}