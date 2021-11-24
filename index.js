const request = require("request");

const argv = require("yargs").argv;

const query = argv.q;

const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search="+ ${query} +"&format=json`;

const TelegramBot = require("node-telegram-bot-api");

const token = "2116807632:AAHNrqwSP-v6Q9MBFvTqcIFPsZnP4jsFA04";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  request(url, function (err, response, body) {
    if (err) {
      const error = "cannot connect to the server";
      console.log(error);
    } else {
      const wiki = JSON.parse(body);
      for (let i = 0; i < wiki[1].length; i++) {
        const message =
          `You searched for ${wiki[1][i]}: And these are the details - ${wiki[2][i]} Follow this link to read more - ${wiki[3][i]}` +
          "\n";
        console.log(message);
        bot.sendMessage(chatId, `${message}`);
      }
    }
  });
});
