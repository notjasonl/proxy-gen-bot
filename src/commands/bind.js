const embeds = require('../embeds');

module.exports = (msg, args, db) => {
    const keysColl = db.collection("keys");
    const usersColl = db.collection("users");
    if (args.length === 1) {
        const userID = msg.author.id;
        usersColl.find({ userID: userID }).toArray().then(userData => {
            if (userData.length != 0) {
                if (/^[0-9A-F]{8}-[0-9A-F]{4}-[0-5][0-9A-F]{3}-[089AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args[0])) {
                    keysColl.find({ key: args[0] }).toArray().then(keyData => {

                    });
                } else {
                    msg.channel.send({ embed: embeds.invalidUUID });
                }
            } else {
                msg.channel.send({ embed: embeds.userNotFound });
            }
        })
        // if (keysColl.find({ userID: userID }))
        
    } else {
        msg.channel.send({ embed: embeds.incorrectArgs });
    }
  }