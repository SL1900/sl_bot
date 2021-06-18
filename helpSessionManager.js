module.exports = {
  newSession: newSession,
  closeSession: closeSession,
  filterReaction: filterReaction,
  init: init,
};
var db = null;
const { formHelpMessage } = require("./commands/help");

function init() {
  db = require("./db_init").getDB();
}

function newSession(mID, uID) {
  db.db("sl_bot").collection("helpSessions").insertOne({
    mID: mID,
    uID: uID,
    page: 1,
  });
}

function closeSession(message, uID) {
  message.removeReaction("⬅️", message.author.id);
  message.removeReaction("❎", message.author.id);
  message.removeReaction("➡️", message.author.id);
  db.db("sl_bot").collection("helpSessions").deleteOne({
    mID: message.id,
    uID: uID,
  });
}

async function changePage(message, uID, dir, doc) {
  var newPage = doc.page + dir;
  if (newPage == 0) return;

  var newMessage = formHelpMessage(newPage);
  if (!newMessage) return;

  message.edit(newMessage);
  var doc = await db
    .db("sl_bot")
    .collection("helpSessions")
    .updateOne(
      {
        mID: message.id,
        uID: uID,
      },
      {
        $set: {
          page: newPage,
        },
      }
    );
}

async function filterReaction(message, emoji, reactor, bot) {
  var doc = await db.db("sl_bot").collection("helpSessions").findOne({
    mID: message.id,
    uID: reactor.id,
  });
  if (!doc) return;

  message = await bot.guilds
    .get(message.channel.guild.id)
    .channels.get(message.channel.id)
    .getMessage(message.id);

  message.removeReaction(emoji.name, reactor.id);

  switch (emoji.name) {
    case "⬅️":
      changePage(message, reactor.id, -1, doc);
      break;
    case "❎":
      closeSession(message, reactor.id);
      break;
    case "➡️":
      changePage(message, reactor.id, 1, doc);
      break;
    default:
      console.log("wrong emoji");
  }
}
