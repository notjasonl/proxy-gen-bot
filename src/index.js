const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');
const { v4 : uuidv4 } = require('uuid');

const cfg = require('../config/config.json');
const rawCommands = require('./commands/commands.json');
const embeds = require('./embeds')
const commands = Object.keys(rawCommands).reduce((obj, c) => {
    obj[c] = Object.assign({}, rawCommands[c], {
      command: require('./commands/' + rawCommands[c].name)
    })
    return obj
  }, {})

const prefix = "!"
const dbName = "proxydata"

const client = new Discord.Client();

// helper functions

// discord stuff
client.on('ready', () => {
    client.user.setPresence({ activity: { name: 'with proxies' }, status: 'online'})
        .then(console.log)
        .catch(console.error);
    console.log("Logged into server!")
    console.log(`Invite Link: https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
});

client.login(cfg.token);

// mongo stuff but also discord stuff

MongoClient.connect(cfg.database).then( dbObj => {
    const db = dbObj.db('proxydata')

    client.on('message', msg => {
        
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    
        const splitMsg = msg.content.split(' ')
        const command = splitMsg[0].slice(1).toLowerCase()
        const args = splitMsg.slice(1)

        if (commands[command]) {
            if (msg.channel.type != 'dm' && commands[command].dmOnly === true) {
                msg.channel.send({ embed: embeds.dmOnly });
                return;
            }
            commands[command].command(msg, args, db)
        } else {
            msg.channel.send({ embed: embeds.unknownCommand})
        }
    });
});

