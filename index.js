require("dotenv").config();
const db_init = require("./db_init");
const Eris = require("eris");
const CommandHandler = require("./CommandHandler");
const helpSessionManager = require("./helpSessionManager");
var BOT_PREFIX = process.env.BOTPREFIX;

var db = null;
var bot = new Eris.CommandClient(process.env.BOTKEY, {
  ws: {
    intents: ["GUILD_MEMBERS"],
  },
});

init();

async function init() {
  db = await db_init.init(process.env.DBURI);
  await bot.connect();
  helpSessionManager.init();
}

bot.on("ready", () => {
  console.log("connected to discord");
  start();
});

function start() {
  bot.on("messageCreate", (message) => {
    if (!startsWith(message.content, BOT_PREFIX)) return;

    var args = message.content.slice(BOT_PREFIX.length).split(/ +/);
    var command = args.shift().toLocaleLowerCase();
    CommandHandler(bot, message, command, args);
  });

  bot.on("messageReactionAdd", (message, emoji, reactor) => {
    helpSessionManager.filterReaction(message, emoji, reactor, bot);
  });
}

function startsWith(text, prefix) {
  var prefixLength = prefix.length;
  return text.substring(0, prefixLength) == prefix;
}
