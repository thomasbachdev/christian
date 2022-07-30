/**
 * Author : Thomas Bach
 * Github : https://github.com/thomasbachdev
 */

const { Client, GatewayIntentBits } = require("discord.js");
const auth = require("./auth.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("Initialization done.");
});

client.login(auth.token);
