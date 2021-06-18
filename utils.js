module.exports = {
  findMembers: findMembers,
};

async function findMembers(guild, usernames) {
  var users = [];
  var members = await guild.fetchMembers();

  for (var username of usernames) {
    membLoop: for (var member of members) {
      if (
        [member.username, member.nick].some((name) => {
          return name === null ? false : name.toLowerCase().includes(username);
        })
      ) {
        users.push(member);
        break membLoop;
      }
    }
  }

  return users;
}
