const sendMessage = require("../sendMessage");
const { send } = require("../sendMessage");
const { createTask } = require("../timer");
var bot = null;

module.exports = {
  execute: (botR, message, args) => {
    bot = botR;
    var commandTextLine = args.join(" ");
    var { text, time } = extractTime(commandTextLine);
    if (text == "") {
      invalidInput("NOTEXT", message);
      return;
    }
    if (time == null) {
      invalidInput("NOTIME", message);
      return;
    }
    createRemind(text, time, message.author.id, message.channel.id);
  },
  remindCallback: remindCallback,
};

function extractTime(str) {
  var regex =
    /(\d{1,2}\s\d{1,2}\:\d{1,2})(?!.*\d{1,2}\s\d{1,2}\:\d{1,2})|(\d{1,2}\.\d{1,2}\s\d{1,2}\:\d{1,2})(?!.*\d{1,2}\.\d{1,2}\s\d{1,2}\:\d{1,2})|(\d{1,2}\:\d{1,2})(?!.*\d{1,2}\:\d{1,2})/gi;

  var res = regex.exec(str);
  if (res == null)
    return {
      time: null,
      text: null,
    };
  var format = res[1] ? 1 : res[2] ? 2 : res[3] ? 3 : 0;

  var time = res[0].split(/\.|\s|\:/);
  var text = str.slice(0, res.index);

  var day, month, hour, minute;

  switch (format) {
    case 1:
      [day, hour, minute] = time;
      break;
    case 2:
      [day, month, hour, minute] = time;
      break;
    case 3:
      [hour, minute] = time;
      break;
  }

  return {
    text: text,
    time: [minute, hour, day, month],
  };
}

function invalidInput(cause, message) {
  switch (cause) {
    case "NOTEXT":
      message.channel.createMessage({
        embed: {
          description: "No text specified",
        },
      });
      break;
    case "NOTIME":
      message.channel.createMessage({
        embed: {
          description: "No time specified",
        },
      });
      break;
    default:
      console.log("Something went wrong");
  }
}

function createRemind(text, time, uID, cID) {
  createTask(time, "remind", true, {
    text: text,
    uID: uID,
    cID: cID,
  });
}

function remindCallback(args) {
  var { text, uID, cID } = args[0];
  sendMessage.send(cID, {
    content: `<@${uID}>`,
    embed: {
      description: text,
    },
  });
}
