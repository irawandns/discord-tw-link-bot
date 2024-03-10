import 'dotenv/config'
// const { Client, GatewayIntentBits } = require("discord.js");
// const http = require('http');
import { Client, GatewayIntentBits } from "discord.js";
import http from 'http';


http.createServer(function (req, res) {
  res.write("Server is running"); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const regex = /(https?:\/\/(?:www\.)?(?:twitter|x)\.com\/\S+)/g;
const token = process.env.DISCORD_BOT_SECRET;
console.log(token, 'token')
const processedMessages = new Set();

client.on("ready", () => {
  console.log("I'm in");
  console.log(client.user.username);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot || processedMessages.has(msg.id)) return; // Ignore messages from bots or already processed messages

  const matches = msg.content.match(regex);
  if (!matches) return; // No matches found, exit

  matches.forEach(async (match) => {
    let response;
    if (match.includes("twitter.com")) {
      response = match.replace("twitter.com", "fxtwitter.com");
    } else if (match.includes("x.com")) {
      response = match.replace("x.com", "fxtwitter.com");
    }

    if (response) {
      // await msg.channel.send(response);
      await msg.reply(response);
      // Remove the embed from the original message
      // Filter out the embeds from the original message
      await msg.suppressEmbeds(true);

      // await msg.delete();
    }
    processedMessages.add(msg.id);
  });
});

client.login(token);
