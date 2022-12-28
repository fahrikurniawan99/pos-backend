const mongoose = require("mongoose");
const { dbHost, dbPass, dbPort, dbName, dbUser } = require("../app/config");
mongoose.connect(
  "mongodb+srv://fahri:tfiVdvnoT9qOaWUl@cluster0.f4hrube.mongodb.net/eduworkstore?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

module.exports = db;
