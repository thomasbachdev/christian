/**
 * Author : Thomas Bach
 * Github : https://github.com/thomasbachdev
 */

const { Client, GatewayIntentBits } = require("discord.js");
const auth = require("./auth.json");
const pref = require("./preferences.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log("Ready !");
});

client.on("messageCreate", (message) => {
  // Check if a command has been send
  if (message.content[0] === "!") {
    let args = message.content.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    const command = args[0];

    switch (command) {
      case "!help":
        handleHelp(message.channel);
        break;
      case "!event":
        handleEvent(message, args);
        break;
      default:
        message.reply("Unknown command, try !help");
    }
  } else {
    // Ratio
    let x = Math.random();
    if (x <= pref["ratio-prob"]) {
      message.reply("ratio").then((reply) => {
        reply.react("👍");
      });
    }
  }
});

function handleHelp(channel) {
  channel.send(
    `Available commands :\n\
❓ !help : command list\n\
👥 !event : create an event (!event "name" JJ/MM/AAAA HH:MM)`
  );
}

function handleEvent(message, args) {
  if (args.length !== 4) {
    message.reply('Invalid syntax');
    return;
  }
  try {
    const eventName = args[1];
    let jma = args[2].split('/');
    let hm = args[3].split(':');
    let eventDate = new Date(+jma[2], +jma[1] - 1, +jma[0], +hm[0], +hm[1]);
    message.reply(`Event created : ${eventName} ${eventDate.toLocaleString()}`);
    createEvent(message.channel, eventName, eventDate);
  } catch (error) {
    console.log(error);
    message.reply('Invalid syntax');
  }
}

function createEvent(channel, eventName, eventDate) {
  setTimeout(() => channel.send('Event now : ' + eventName), eventDate - Date.now());
}

client.login(auth.token);
