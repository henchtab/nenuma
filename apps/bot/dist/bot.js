import"dotenv/config";import{limit as o}from"@grammyjs/ratelimiter";import{Bot as t}from"grammy";var e=new t(`${process.env.BOT_TOKEN}`,{client:{environment:process.env.NODE_ENV==="production"?"prod":"test"}});e.use(o());e.command("start",async n=>{await n.reply(`\u26A0\uFE0F <b>Message from the CEO:</b>

\u{1F440} Hello everyone! My name is Illia. We're thrilled to introduce the <b>Nenuma Protocol</b>, a groundbreaking solution for creating <u>on-chain</u> <i>derivatives</i> on the TON blockchain. \u{1F389}

\u{1F938} Our protocol ensures <b>secure</b> transactions, minimizing the risks of fraud and default, and enhancing user trust and confidence. \u{1F6E1}

\u{1FAE6} We're excited to announce that you can now access a demo of our simple <u>derivatives exchange</u>, @nenuma_bot, where you can start trading on-chain <b>BTC/USDT</b> options on <i>Testnet</i>. \u{1F4C8}

\u{1F4DE} We welcome your feedback at @henchtab. It will help us improve our product and add new types of derivatives for trading. \u{1F37E}

\u{1F4B0} We are also working on a significant update to <b>reduce transaction fees</b> and enable us to go live on the <i>Mainnet</i>, along with providing <u>developer tools</u> and <i>documentation</i> by the end of July. \u{1F4F1}

\u{1F337} Thank you for your support and feedback. \u{1F37F}`,{parse_mode:"HTML",reply_markup:{inline_keyboard:[[{text:"\u{1F4C8} Start Trading",web_app:{url:`${process.env.WEB_APP_URL}`}}],[{text:"\u{1F36D} Play with Smart Contracts",web_app:{url:`${process.env.WEB_APP_URL}/?redirectUrl=playground`}}]]}})});e.command("ping",async n=>{await n.reply("Pong \u{1F3D3}")});e.start();
