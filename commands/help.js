const helpSessionManager = require("../helpSessionManager");

module.exports = {
  execute: (bot, message, args) => {
    createHelpMessage(message.channel, message.author.id);
  },
  formHelpMessage: formHelpMessage,
};

async function createHelpMessage(channel, uID) {
  var helpMessage = await channel.createMessage(formHelpMessage(1));
  helpMessage.addReaction("⬅️");
  helpMessage.addReaction("❎");
  helpMessage.addReaction("➡️");
  helpSessionManager.newSession(helpMessage.id, uID);
}

function formHelpMessage(page) {
  var pageCount = require("../commandsList").length;
  var commandsList = require("../commandsList").slice((page - 1) * 5, page * 5);
  if (commandsList.length == 0) return null;

  var embed = {
    title: "SL_bot help page",
    description: `Page ${page}/${Math.ceil(pageCount / 5)}`,
    fields: [],
  };
  for (var command of commandsList) {
    embed.fields.push({
      name: command.command,
      value: command.description,
    });
  }
  return {
    embed: embed,
  };
}
