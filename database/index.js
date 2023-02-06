const mongoose = require("mongoose");
const url = "mongodb+srv://fahri:tfiVdvnoT9qOaWUl@cluster0.f4hrube.mongodb.net/eduworkstore?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

module.exports = db;
