const embeds = require('../embeds');

module.exports = (msg, args, db) => {
    msg.channel.send({ embed: embeds.help })
}