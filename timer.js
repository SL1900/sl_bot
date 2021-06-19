const { remindCallback } = require("./commands/remind");

class Task {
  constructor(time, type, onetime, args) {
    this.time = new Time(...time);
    this.type = type;
    this.args = args;
    this.onetime = onetime;
  }
}
class Time {
  constructor(minute, hour, day, month, year) {
    this.minute = minute;
    this.hour = hour;
    this.day = day;
    this.month = month;
    this.year = year;
  }
  compare(time) {
    for (var test in time) {
      if (time[test] == undefined) continue;
      if (time[test] != this[test]) return false;
    }
    return true;
  }
}

module.exports = {
  startTimer: startTimer,
  createTask: createTask,
};

var db = null;

function startTimer() {
  db = require("./db_init").getDB();
  checkTasks();
  setInterval(checkTasks, 60 * 1e3);
}

async function checkTasks() {
  var tasks = await getTasks();
  var d = new Date();
  var currentTime = new Time(
    d.getMinutes(),
    d.getHours(),
    d.getDate(),
    d.getMonth() + 1,
    d.getFullYear()
  );

  for (let task of tasks) {
    if (currentTime.compare(task.time)) {
      switch (task.type) {
        case "remind":
          remindCallback(task.args);
          break;
        default:
          console.log("wrong task type");
      }
      if (task.onetime) removeTask(task);
    }
  }
}

function createTask(time, type, onetime, ...args) {
  var task = new Task(time, type, onetime, args);
  db.db("sl_bot").collection("remind_tasks").insertOne(task);
}

async function getTasks() {
  var tasks = await (
    await db.db("sl_bot").collection("remind_tasks").find({})
  ).toArray();
  return tasks;
}
function removeTask(task) {
  db.db("sl_bot").collection("remind_tasks").deleteOne({
    _id: task._id,
  });
}
