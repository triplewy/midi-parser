const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/my_database");

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

let db;

const { Schema } = mongoose;
const { ObjectId } = Schema;

const artist = new Schema({
  _id: ObjectId,
  name: String,
  songs: Array
});

MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
  })
  .catch(err => {
    console.log(err);
  });

module.exports = {
  db
};
