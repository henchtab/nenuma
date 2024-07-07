import 'dotenv/config';
import { Bot, type Context } from 'grammy';
import { type EmojiFlavor, emojiParser } from '@grammyjs/emoji';

type MyContext = EmojiFlavor<Context>;

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<MyContext>(`${process.env.BOT_TOKEN}`, {
  client: {
    environment: process.env.NODE_ENV === 'production' ? 'prod' : 'test',
  },
});
bot.use(emojiParser());

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', async (ctx) => {
  await ctx.reply(
    `*Let's get started\\!* ${ctx.emoji`${'money_with_wings'}`}

Please tap the button below to start trading with Nenuma\\!`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `${ctx.emoji`${'chart_increasing'}`} Start Trading`,
              web_app: {
                url: `${process.env.WEB_APP_URL}`,
              },
            },
          ],
          [
            {
              text: `${ctx.emoji`${'lollipop'}`} Play with Smart Contracts`,
              web_app: {
                url: `${process.env.WEB_APP_URL}/?redirectUrl=playground`,
              },
            },
          ],
        ],
      },
    }
  );
});

bot.command('ping', async (ctx) => {
  await ctx.replyWithEmoji`Pong ${'ping_pong'}`; // => Pong 🏓
});

// Start the bot.
bot.start();
