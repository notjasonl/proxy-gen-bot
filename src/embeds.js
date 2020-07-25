const Discord = require('discord.js');
const commands = require('./commands/commands.json');
const version = require('../package.json').version;

module.exports = {
    errors: {
        noIPs: {
            title: '**No IPs**  🤔',
            description: 
                'There don\'t appear to be any ips bound to your account!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        addressNotFound: {
            title: '**Address Not Found**  🤔',
            description: 
                'The ip address you entered isn\'t bound to your account, try again!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        addressBound: {
            title: '**Address Bound**  🤔',
            description: 
                'The ip address you entered has already been bound to another account, try again!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        countryNotFound: {
            title: '**Country Not Found**  🗺',
            description: 
                'The country you entered was not found/unavailable, try again!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        proxyTypeNotFound: {
            title: '**Proxy Type Not Found**  🔎',
            description: 
                'The proxy type you entered was invalid!',
            color: 14242639,
            fields: [
                {
                    name: "Note",
                    value: "Proxy type should be either `sticky` or `rotating`."
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        shopifyAuthError: {
            title: '**Authentication Error**  🔒',
            description: 
                'There was an issue authenticating with the Shopify API, please DM staff or jazonl#2576!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        proxiwareAuthError: {
            title: '**Authentication Error**  🔒',
            description: 
                'There was an issue authenticating with the Proxiware API, please DM staff or jazonl#2576!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        emailMatchError: {
            title: '**Emails Don\'t Match**  📧',
            description: 
                'The email entered doesn\'t match the one associated with the order!',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        orderClaimed: {
            title: '**Order Claimed**  💳‼',
            description: 
                'Your order has already been claimed! Please contact support if you believe this is in error.',
            color: 14242639,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    prompts: {
        removeIP: {
            title: '**IP Binding**  🗺',
            description:
                'What ip would you like to remove?',
            color: 161240,
            fields: [
                {
                    name: "What **is** my public ip?",
                    value: "You can find it by going [here](https://www.whatismyip.com/what-is-my-public-ip-address/)."
                },
                {
                    name: "How do I find my bound ips?",
                    value: "You can use the `!ips` command to see your ips"
                },
                {
                    name: "Timeout",
                    value: "You have 60 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        addIP: {
            title: '**IP Binding**  🗺',
            description:
                'What ip would you like to add?',
            color: 161240,
            fields: [
                {
                    name: "What **is** my public ip?",
                    value: "You can find it by going [here](https://www.whatismyip.com/what-is-my-public-ip-address/)."
                },
                {
                    name: "Why do you need this?",
                    value: "The proxy provider requires this value to track how much data you've used."
                },
                {
                    name: "Timeout",
                    value: "You have 60 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        publicIP: {
            title: '**Order Claiming**  🏬',
            description:
                'What\'s your public ip?',
            color: 161240,
            fields: [
                {
                    name: "What **is** my public ip?",
                    value: "You can find it by going [here](https://www.whatismyip.com/what-is-my-public-ip-address/)."
                },
                {
                    name: "Why do you need this?",
                    value: "The proxy provider requires this value to track how much data you've used."
                },
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        shopifyEmail: {
            title: '**Order Claiming**  🏬',
            description:
                'What\'s the email you used to place your proxy order?',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        shopifyOrder: {
            title: '**Order Claiming**  🏬',
            description:
                'What\'s your Shopify order number?',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        numKeys: {
            title: '**Key Generation**  🔑',
            description:
                'How many keys do you want to generate?',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        keysData: {
            title: '**Key Generation**  🔑',
            description:
                'How much bandwidth do you want each key to have? (in GB)',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        proxyCountry: (countries) => {
            return {
                title: '**Proxy Generation**  🌐',
                description:
                    'Which country do you want to generate proxies for?',
                color: 161240,
                fields: [
                    {
                        name: "**Countries**",
                        value: countries
                    },
                    {
                        name: "Timeout",
                        value: "You have 30 seconds to enter a value, or type `cancel`"
                    }
                ],
                footer: {
                    text: "Proxy Support Bot | jazonl#2576"
                }
            }
        },
        proxyType: {
            title: '**Proxy Generation**  🌐',
            description:
                'What type of proxy would you like to generate? (Sticky or Rotating)',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        },
        numProxies: {
            title: '**Proxy Generation**  🌐',
            description:
                'How many proxies would you like to generate?',
            color: 161240,
            fields: [
                {
                    name: "Timeout",
                    value: "You have 30 seconds to enter a value, or type `cancel`"
                }
            ],
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    showIPs: (ips) => {
        return {
            title: '**Bound IPs**  🔑',
            description:
                `There are ${ips.length} ips bound to your account:`,
            fields: [
                {
                    name: "IPs",
                    value: ips
                }
            ],
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    getData: (used, starting, percent) => {
        return {
            title: '**Check Data Usage**  ✅',
            description:
                `You've used ${used} GB (${percent}) of your ${starting} GB of data!`,
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    generateSuccess: (country, type, amount) => {
        return {
            title: '**Proxies Generated Successfully**  ✅',
            description:
                `You successfully generated **${amount}** proxies!`,
            fields: [
                {
                    name: 'Location',
                    value: `${country}`,
                    inline: true
                },
                {
                    name: 'Type',
                    value: `${type}`,
                    inline: true
                }
            ],
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    ipAdded: (pubIP) => {
        return {
            title: '**IP Bound Successfully** 😄',
            description:
                `You successfully bound ${pubIP} to your account!`,
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    ipRemoved: (pubIP) => {
        return {
            title: '**IP Removed Successfully** 😄',
            description:
                `You successfully removed ${pubIP} from your account!`,
            color: 6076508,
            footer: {
                text: "Proxy Support Bot | jazonl#2576"
            }
        }
    },
    orderBoundSuccess: (order, data, addedData) => {
        return {
            title: '**Order Claimed Successfully** 😄',
            description:
                `You successfully claimed order **#${order}**! Please use \`!addip\` to bind your ip.`,
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
    },
    keyGenSuccess: (num, keys) => {


        // finish this



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
        
    },
    invalidIP: {
        title: '**Invalid IP**  😕',
        description: 
            'Your IP doesn\'t match the format xxx.xxx.xxx.xxx!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    noOrder: {
        title: '**Order Not Found**  🔎',
        description: 
            'Your order wasn\'t found, please check your order number!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    gettingOrder: {
        title: '**Shopify Order**  🛍',
        description: 
            'Getting your order details, please wait!',
        color: 161240,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    cancelled: {
        title: '**Command Cancelled**  ❌',
        description: 
            'You cancelled the command, please try again!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    noAnswer: {
        title: '**Operation Timed Out**  ⏰',
        description: 
            'The command timer expired, please try again!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    notNum: {
        title: '**Invalid Data Type**  🔢',
        description: 
            'The command expected an integer input, please try again!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    dmOnly: {
        title: '**Invalid Channel**  💬',
        description: 
            'The command you typed is intended to be used in DM only for privacy concerns.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
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
              name: "!" + k,
              value: commands[k].desc + "\nFormat: !" + k + " " + commands[k].args
            }
          }),
        footer: { 
            text: "Proxy Support Bot | jazonl#2576" 
        }
    },
    incorrectArgs: {
        title: '**Invalid Syntax**  ⚠',
        description:
            'You provided the incorrect amount of arguments to the command! Check `!help` for command usage.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    userNotFound: {
        title: '**User Not Found**  🤔',
        description:
            'A user was not found with your Discord ID! Please make sure you\'ve registered with `!bind`!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    invalidUUID: {
        title: '**Invalid UUID Format**  ⌨',
        description:
            'Your key wasn\'t in valid UUIDv4 format! Please check your spelling and try again.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    invalidKey: {
        title: '**Invalid Key**  🔐',
        description:
            'Your key isn\'t valid! Please check your spelling or contact staff.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    keyClaimed: {
        title: '**Key Claimed**  🔑‼',
        description:
            'The given key has already been claimed! Please contact staff if you believe this is in error.',
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
    },
    invalidEmail: {
        title: '**Invalid Email**  📧',
        description:
            'Your email doesn\'t match the format `user@mail.com`! Please check your spelling.',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    userAlreadyExists: {
        title: '**User Already Exists**  🤔',
        description:
            'There\'s already a user bound to this discord ID, please check your email for credentials or contact staff!',
        color: 14242639,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    },
    userSuccess: {
        title: '**User Created!**  👋',
        description:
            'Successfully created a user bound to your discord account!',
        color: 6076508,
        footer: {
            text: "Proxy Support Bot | jazonl#2576"
        }
    }
}

