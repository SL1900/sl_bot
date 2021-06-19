var { findMembers } = require("../utils");

module.exports = {
  execute: async (bot, message, args) => {
    if (args.length == 0) {
      showAvatar(message.author, message.channel);
      return;
    }
    var users = await findMembers(message.channel.guild, args);
    users = [...new Set(users)];

    for (var user of users) {
      showAvatar(user, message.channel);
    }
  },
};

function showAvatar(user, channel) {
  var avatarURL = user.avatarURL.replace(/\?size=\d+/, "?size=2048");
  channel.createMessage({
    embed: {
      title: `${user.username}'s avatar`,
      description: `User link: <@${user.id}>`,
      image: {
        url: avatarURL,
      },
      color: 16777215,
    },
  });
}
