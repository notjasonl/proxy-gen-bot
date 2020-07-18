const embeds = require('../embeds');

module.exports = (msg, args, db) => {
    console.log(embeds.help)
    const testDB = db.collection('keys')
    console.log(testDB)
    msg.channel.send({ embed: embeds.help })
  }