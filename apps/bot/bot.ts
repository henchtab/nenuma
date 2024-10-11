import "dotenv/config";
import { limit } from "@grammyjs/ratelimiter";
import { Bot } from "grammy";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(`${process.env.BOT_TOKEN}`, {
  client: {
    environment: process.env.NODE_ENV === "production" ? "prod" : "test",
  },
});

bot.use(limit());

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", async (ctx) => {
  await ctx.reply(
    `⚠️ <b>Message from the CEO:</b>

👀 Hello everyone! My name is Illia. We're thrilled to introduce the <b>Nenuma Protocol</b>, a groundbreaking solution for creating <u>on-chain</u> <i>derivatives</i> on the TON blockchain. 🎉

🤸 Our protocol ensures <b>secure</b> transactions, minimizing the risks of fraud and default, and enhancing user trust and confidence. 🛡

🫦 We're excited to announce that you can now access a demo of our simple <u>derivatives exchange</u>, @nenuma_bot, where you can start trading on-chain <b>BTC/USDT</b> options on <i>Testnet</i>. 📈

📞 We welcome your feedback at @henchtab. It will help us improve our product and add new types of derivatives for trading. 🍾

💰 We are also working on a significant update to <b>reduce transaction fees</b> and enable us to go live on the <i>Mainnet</i>, along with providing <u>developer tools</u> and <i>documentation</i> by the end of July. 📱

🌷 Thank you for your support and feedback. 🍿`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📈 Start Trading",
              web_app: {
                url: `${process.env.WEB_APP_URL}`,
              },
            },
          ],
          [
            {
              text: "🍭 Play with Smart Contracts",
              web_app: {
                url: `${process.env.WEB_APP_URL}/?redirectUrl=playground`,
              },
            },
          ],
        ],
      },
    },
  );
});

bot.command("ping", async (ctx) => {
  await ctx.reply("Pong 🏓");
});

// Start the bot.
bot.start();
