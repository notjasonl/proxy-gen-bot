const embeds = require('../embeds');
const bcrypt = require('bcrypt');

module.exports = (msg, args, db) => {
    const keysColl = db.collection("keys");
    const usersColl = db.collection("users");

    const userID = msg.author.id;

    if (args.length != 3) {
        msg.channel.send({ embed: embeds.incorrectArgs });
        return;
    }

    const email = args[0];
    const username = args[1];
    const password = args[2];
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)) {
        msg.channel.send({ embed: embeds.invalidEmail });
        return;
    }

    usersColl.find({ userID: userID }).toArray().then(userData => {
        if (userData.length != 0) {
            msg.channel.send({ embed: embeds.userAlreadyExists });
            return;
        }

        bcrypt.hash(password, 10, (err, hash) => {
            usersColl.insertOne({
                userID: userID,
                email: email,
                username: username,
                password: hash,
                keys: [],
                data: 0
            }).then((err, data) => {
                if (err) console.log(err)
                console.log(data);
            });
        })
        msg.channel.send({ embed: embeds.userSuccess })
    });
}