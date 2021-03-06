const http = require("http");
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://partner1er1.glitch.me/`);
}, 280000);

const Discord = require("discord.js");
const config = require("./config.json");
const ms = require("ms");
const enmap = require("enmap");
const moment = require("moment");

const client = new Discord.Client();
const db = new enmap({ name: "test" });

const prefix = config.prefix;
const token = config.token;
const time = config.time;

client.on("ready", () => {
  console.log("logged in as " + client.user.username);
});

client.on("message", async message => {
  if (message.content === 'join') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  
  if (
    message.author.bot ||
    message.channel.type !== "dm" ||
    !message.content.includes("discord.gg")
  )
    return;

  var user = message.author;
  if (db.get(user.id) == undefined) {
    db.ensure(user.id, {
      last: null
    });
  }

  if (db.get(user.id, "last") !== null && moment().diff(moment(parseInt(db.get(user.id, "last"))), "h") < time) {
    message.channel.send(`> **You need to wait until it ends ${moment(parseInt(db.get(user.id, "last"))).add(time, "h").fromNow()}**`);
    return;
  }
  
  var ad_message = message.content.replace("@everyone", "").replace("@here", "");

  client.channels.cache
    .get(config.ad_channel)
    .send(ad_message + "\n\n<@" + user.id + ">");


  message.channel.send(">>> **Done.\nCheck <#"+client.channels.cache.get(config.ad_channel).id +
      ">**"
  );

  db.set(user.id, moment().format("x"), "last");
});

client.login("NzM3OTgzOTk1ODU3MzM4Mzg4.XyFTJw.i5nl3QbUx6OeMBSJb8QL6Tqo4Cs");
