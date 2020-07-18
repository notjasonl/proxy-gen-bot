const Discord = require('discord.js');
const commands = require('./commands/commands.json');
const version = require('../package.json').version;

module.exports = {
    unknownCommand: {
        title: '**Invalid Command**  ⛔',
        description: 
            'The command you typed was invalid. Look at `!help` for a list of all commands.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    help: {
        title: '**Help**  ℹ',
        color: 161240,
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
        title: '**Invalid Syntax**  ⚠',
        description:
            'You provided the incorrect amount of arguments to the command! Check `!help` for command usage',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    userNotFound: {
        title: '**User Not Found**  🤔',
        description:
            'A user was not found with your Discord ID! Please make sure you\'ve registered with `!newuser`!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    invalidUUID: {
        title: '**Invalid UUID Format**  ⌨',
        description:
            'Your key wasn\'t in valid UUIDv4 format! Please check your spelling and try again',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    invalidKey: {
        title: '**Invalid Key**  🔐',
        description:
            'Your key isn\'t valid! Please check your spelling or contact staff',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    keyClaimed: {
        title: '**Key Claimed**  🔑‼',
        description:
            'The given key has already been claimed! Please contact staff if you believe this is in error',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    keySuccess: (data, addedData, key) => {
        return {
            title: '**Key Bound Successfully** 😄',
            description:
                `You successfully bound key **${key}** to your account!`,
            fields: [
                {
                    name: 'Current Data',
                    value: `${data} GB`,
                    inline: true
                },
                {
                    name: 'Added Data',
                    value: `+${addedData} GB`,
                    inline: true
                }
            ],
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    }
}

