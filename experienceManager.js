module.exports = {
  countMessage: countMessage,
};

async function countMessage(db, message) {
  var cooldown = 60 * 1e3;
  var currentTime = Date.now();
  var exp = Math.floor(Math.random() * 15 + 10);

  var userDoc = await db
    .db("sl_bot")
    .collection("experience")
    .findOne({ uID: message.author.id, gID: message.channel.guild.id });
  console.log(currentTime - userDoc.lastTimestamp);
  if (currentTime - userDoc.lastTimestamp < cooldown) return;
  db.db("sl_bot")
    .collection("experience")
    .updateOne(
      {
        uID: message.author.id,
        gID: message.channel.guild.id,
      },
      {
        $inc: {
          exp: exp,
        },
        $set: {
          lastTimestamp: Date.now(),
        },
      },
      { upsert: true }
    );
}
