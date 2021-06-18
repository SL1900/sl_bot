module.exports = {
  execute: async (bot, message, args) => {
    var reply = await message.channel.createMessage("Pinging...");
    var timePassed = reply.timestamp - message.timestamp;
    reply.edit(`Ping: ${timePassed}ms`);
  },
};
