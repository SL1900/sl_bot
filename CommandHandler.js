var path = require("path");
var commandsDir = "./commands/";

module.exports = function (bot, message, command, args) {
  delete require.cache[path.resolve(`./commandsList.js`)];
  var cmd = require("./commandsList").find((commandObject) => {
    return commandObject.command == command;
  });
  if (!cmd) return;

  var filename = `${commandsDir}${cmd.file}`;
  var pathToFile = path.resolve(filename);

  delete require.cache[pathToFile];
  require(filename).execute(bot, message, args);
};
