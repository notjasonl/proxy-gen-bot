const embeds = require('../embeds');

module.exports = (msg, args, db) => {
    const keysColl = db.collection("keys");
    const usersColl = db.collection("users");

    if (args.length != 1) {
        msg.channel.send({ embed: embeds.incorrectArgs });
        return;
    }
    const userID = msg.author.id;
    usersColl.find({ userID: userID }).toArray().then(userData => {
        if (userData.length === 0) {
            msg.channel.send({ embed: embeds.userNotFound });
            return;
        }
        if (/^[0-9A-F]{8}-[0-9A-F]{4}-[0-5][0-9A-F]{3}-[089AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args[0])) {
            keysColl.find({ key: args[0] }).toArray().then(keyData => {
                if (keyData.length === 0) {
                    msg.channel.send({ embed: embeds.invalidKey });
                    return;
                }
                if (!keyData[0].claimed) {
                    const addData = parseInt(keyData[0].bandwidth);
                    const now = new Date();
                    const epochTime = Math.round(now.getTime() / 1000);
                    keysColl.updateOne(
                        { key: args[0] },
                        {
                            $set: {
                                claimed: true,
                                claimedTimestamp: epochTime
                            }
                        }
                    )
                    usersColl.updateOne(
                        { userID: userID },
                        {
                            $push: {
                                keys: args[0]
                            },
                            $inc: {
                                data: addData
                            }
                        }
                    )
                    msg.channel.send({ embed: embeds.keySuccess(userData[0].data + addData, addData, args[0]) })
                } else {
                    msg.channel.send({ embed: embeds.keyClaimed });
                }
            });
        } else {
            msg.channel.send({ embed: embeds.invalidUUID });
        }
    })
  }