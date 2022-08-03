/**
 * Author : Thomas Bach
 * Github : https://github.com/thomasbachdev
 */

const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const auth = require("./auth.json");
const pref = require("./preferences.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
  ],
});

client.once("ready", () => {
  console.log("Ready !");
  client.user.setActivity("!help", { type: ActivityType.Listening });
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
      case "!coin":
        handleCoin(message);
        break;
      default:
        message.reply("Unknown command, try !help");
    }
  } else if (message.author.id !== client.user.id) {
    // Ratio
    handleRatio(message);
  }
});

function handleRatio(message) {
  // Ratio if random number under proba
  let x = Math.random();
  if (x <= pref["ratio-prob"]) {
    message.reply("ratio").then((reply) => {
      reply.react("👍");
    });

    // Get server ref
    let guild = message.guild;

    try {
      // Mute the user from sending messages in every channel
      guild.channels.cache.forEach((channel, id) => {
        if(channel.permissionOverwrites) {
          channel.permissionOverwrites.create(message.author, {
            SendMessages: false,
          });
        }
      });

      // Wait for the mute time and unmute the user
      setTimeout(() => {
        guild.channels.cache.forEach((channel, id) => {
          if(channel.permissionOverwrites) {
            channel.permissionOverwrites.create(message.author, {
              SendMessages: null,
            });
          }
        });
      }, pref["mute-time"] * 1000);
    } catch (error) {
      console.log(error);
    }
  }
}

function handleHelp(channel) {
  channel.send(
    `>>> **Available commands :**\n\
❓  **!help :** command list\n\
👥  **!event :** create an event (!event "name" JJ/MM/AAAA hh:mm)\n\
🪙  **!coin :** coin-flip`
  );
}

function handleEvent(message, args) {
  if (args.length !== 4) {
    message.reply("Invalid syntax");
    return;
  }
  try {
    const eventName = args[1];
    let jma = args[2].split("/");
    let hm = args[3].split(":");
    let eventDate = new Date(+jma[2], +jma[1] - 1, +jma[0], +hm[0], +hm[1]);
    if (eventDate - Date.now() > 1000) {
      message
        .reply(
          `>>> 👥  **Event created :** ${eventName}\n📅  ${eventDate.toLocaleString(
            "fr-FR"
          )}\n▶️  React with 👍 to join`
        )
        .then((eventConfirm) => {
          eventConfirm.react("👍");
          createEvent(eventConfirm, eventName, eventDate);
        });
    } else {
      message.reply("Invalid date");
    }
  } catch (error) {
    console.log(error);
    message.reply("Invalid syntax");
  }
}

function handleCoin(message) {
  const x = Math.round(Math.random());
  x ? message.reply("🪙 Head") : message.reply("🟡 Tail");
}

function createEvent(eventConfirm, eventName, eventDate) {
  let users = [];
  // Create a reaction collector
  const filter = (reaction, user) => reaction.emoji.name === "👍";
  let collector = eventConfirm.createReactionCollector({
    filter,
    time: eventDate - Date.now() - 200,
  });
  collector.on("end", (collected) => {
    users = collected.at(0).users.cache;
  });

  // Timeout
  setTimeout(() => {
    let participantsTags = "";
    if (users.length !== 0) {
      users.forEach((user, key) => {
        participantsTags += user.toString() + " ";
      });
    }

    eventConfirm.channel.send(
      `>>> ⏰  **Now :** ${eventName}\n👋  ${participantsTags}`
    );
  }, eventDate - Date.now());
}

client.login(auth.token);
