require("dotenv").config();
const db_init = require("./db_init");
const Eris = require("eris");
const CommandHandler = require("./CommandHandler");
const helpSessionManager = require("./helpSessionManager");
const { startTimer } = require("./timer");
const sendMessage = require("./sendMessage");
const experienceManager = require("./experienceManager");
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
  sendMessage.init(bot);
  helpSessionManager.init();
  startTimer();
}

bot.on("ready", () => {
  var guildCount = bot.guilds.reduce((sum) => {
    return ++sum;
  }, 0);
  console.log(`Bot connected to Discord\nNumber of guilds: ${guildCount}`);
  start();
});

function start() {
  bot.on("messageCreate", (message) => {
    experienceManager.countMessage(db, message);
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
  return text.substring(0, prefix.length) == prefix;
}
