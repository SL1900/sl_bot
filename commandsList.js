module.exports = [
  {
    command: "help",
    file: "help.js",
    description: `Show this page
    Usage: ${process.env.BOTPREFIX}help`,
  },
  {
    command: "ping",
    file: "ping.js",
    description: `Ping into the void
    Usage: ${process.env.BOTPREFIX}ping`,
  },
  {
    command: "avatar",
    file: "avatar.js",
    description: `Show user(s) avatar(s)
    Usage: ${process.env.BOTPREFIX}avatar userName anotherUser @someOtherUser`,
  },
  {
    command: "remind",
    file: "remind.js",
    description: `Remind something at some time
    Usage: ${process.env.BOTPREFIX}remind "Some text here" DD HH:MM`,
  },
];
