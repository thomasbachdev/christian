/**
 * Author : Thomas Bach
 * Github : https://github.com/thomasbachdev
 */

import { Client } from "discord.js";
import pref from "./preferences.json" assert { type: "json" };

const client = new Client();

client.once('ready', () => {
    console.log('Initialization done.')
});

client.login(pref.token);