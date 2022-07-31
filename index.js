/**
 * Author : Thomas Bach
 * Github : https://github.com/thomasbachdev
 */

const { Client, GatewayIntentBits } = require('discord.js');
const auth = require('./auth.json');
const pref = require('./preferences.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once('ready', () => {
  console.log('Ready !');
});

client.on('messageCreate', (message) => {
  let x = Math.random();
  if (x <= pref['ratio-prob']) {
    message.reply('ratio', ).then((reply) => {
      reply.react('👍');
    });
  }
});

client.login(auth.token);
