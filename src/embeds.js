const Discord = require('discord.js');
const commands = require('./commands/commands.json');
const version = require('../package.json').version;

module.exports = {
    unknownCommand: {
        title: '**Invalid Command** :no_entry:',
        description: 
            'The command you typed was invalid. Look at `!help` for a list of all commands.',
        color: 2539471,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    help: {
        title: '**Help** :information_source:',
        color: 2539471,
        fields: Object.keys(commands).map(k => {
            return {
              name: k,
              value: commands[k].desc
            }
          }),
        footer: { 
            text: "Proxy Support Bot | jazonl#2576" 
        }
    },
    incorrectArgs: {
        title: '**Invalid Syntax** :warning:',
        description:
            'You provided the incorrect amount of arguments to the command! Check `!help` for command usage',
        color: 2539471,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    }
}

