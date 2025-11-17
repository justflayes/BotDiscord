require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

// Buat client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Event: Bot sudah online
client.on("ready", () => {
    console.log(`Bot sudah online sebagai: ${client.user.tag}`);
});

// Event: Saat ada pesan baru
client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith("!ai")) return;

    const prompt = msg.content.slice(3).trim();
    if (!prompt) return msg.reply("Ketik: !ai <pertanyaan>");

    try {
        const thinking = await msg.channel.send("⏳ Sedang berpikir...");

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        await thinking.delete();
        msg.reply(response.choices[0].message.content);

    } catch (err) {
        console.error(err);
        msg.reply("⚠ Terjadi kesalahan AI.");
    }
});

client.login(process.env.DISCORD_TOKEN);