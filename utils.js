module.exports = {
  findMembers: findMembers,
};
async function findMembers(guild, usernames) {
  var users = [];
  var members = await guild.fetchMembers();

  for (var username of usernames) {
    console.log(username);
    var match = username.match(/(?<=\<\@\!)\d+(?=\>)/);
    var id = match ? match[0] : 0;
    membLoop: for (var member of members) {
      if (
        [member.username, member.nick].some((name) => {
          return name === null ? false : name.toLowerCase().includes(username);
        }) ||
        member.id == id
      ) {
        users.push(member);
        break membLoop;
      }
    }
  }

  return users;
}
