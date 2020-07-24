const embeds = require('../embeds');
const { v4 : uuidv4 } = require('uuid');

const now = new Date();

module.exports = (msg, args, db) => {
    const keysColl = db.collection("keys");

    let num;
    let data;

    if (args.length != 0) {
        msg.channel.send({ embed: embeds.incorrectArgs });
        return;
    }

    msg.channel.send({ embed: embeds.prompts.numKeys });
    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
        { max: 1, time: 30000 }).then(collected => {
            if (collected.first().content.toLowerCase() == 'cancel') {
                msg.channel.send({ embed: embeds.cancelled });
                return;
            }
            try {
                num = parseInt(collected.first().content);
            } catch (err) {
                msg.channel.send({ embed: embeds.notNum });
                console.log(err);
                return;
            }
            msg.channel.send({ embed: embeds.prompts.keysData })
            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                { max: 1, time: 30000 }).then(collected => {
                    if (collected.first().content.toLowerCase() == 'cancel') {
                        msg.channel.send({ embed: embeds.cancelled });
                        return;
                    }
                    try {
                        data = parseInt(collected.first().content);
                    } catch (err) {
                        msg.channel.send({ embed: embeds.notNum });
                        console.log(err);
                        return;
                    }
                    let keys = []
                    for (let i = 0; i < num; i++) {
                        let epochTime = Math.round(now.getTime() / 1000);
                        let tempKey = {
                            key: uuidv4().toUpperCase(),
                            bandwidth: data.toString(),
                            creationTimestamp: epochTime,
                            claimed: false,
                            claimedTimestamp: 0
                        }
                        keys.push(tempKey);
                    }

                    let order = {
                        orderID
                    }

                    keysColl.insertOne(keys, (err, data) => {
                        if (err) console.log(err)
                        console.log(data)
                    })

                }).catch(() => {
                    msg.channel.send({ embed: embeds.noAnswer })
                })
        }).catch(() => {
            msg.channel.send({ embed: embeds.noAnswer })
        })
    // key generation + database ops go here
    
}