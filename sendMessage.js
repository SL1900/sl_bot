module.exports = {
  init: init,
  send: send,
};

var bot = null;

function init(botR) {
  bot = botR;
}
function send(cID, message) {
  console.log(cID, message);
  bot.createMessage(cID, message);
}
