const MongoClient = require("mongodb").MongoClient;

var db = null;

module.exports = {
  init: (uri) => {
    return new Promise((res, rej) => {
      const mongoClient = new MongoClient(uri, {
        useUnifiedTopology: true,
      });
      mongoClient.connect(function (err, db_client) {
        if (err) return console.log(err);
        console.log("connected to db");
        db = db_client;
        res(db_client);
      });
    });
  },
  getDB: () => {
    return db;
  },
};
