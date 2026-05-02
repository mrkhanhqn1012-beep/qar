require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

// KEEP ALIVE (QUAN TRỌNG CHO RENDER)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server keep-alive running");
});

// MESSAGE EVENT
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    // 🎥 YOUTUBE
    if (message.content.startsWith("!yt")) {
      const query = encodeURIComponent(
        message.content.replace("!yt ", "").trim()
      );

      if (!query) return message.reply("Nhập từ khóa đi 😢");

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${process.env.YOUTUBE_API}&maxResults=1`;

      const res = await axios.get(url);

      if (!res.data.items || res.data.items.length === 0) {
        return message.reply("Không tìm thấy video!");
      }

      const video = res.data.items[0];
      const link = `https://youtube.com/watch?v=${video.id.videoId}`;

      message.reply(`🎥 ${video.snippet.title}\n${link}`);
    }

  } catch (err) {
    console.error(err);
    message.reply("Có lỗi xảy ra 😢");
  }
});

client.login(process.env.TOKEN);