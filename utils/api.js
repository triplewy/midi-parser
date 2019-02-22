const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

function addSong(metadata, tracks, normalizedTracks) {
  console.log(metadata);
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      db.collection('artists').updateOne(
        {
          name: 'Sam Gellaitry'
        },
        {
          $push: {
            songs: {
              name: metadata.title,
              year: metadata.year,
              tracks: tracks,
              normalizedTracks: normalizedTracks
            }
          }
        }, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            console.log(`Modified ${result.result.n}`);
            client.close();
            return resolve()
          }
      })
    })
  })
}

module.exports = {
  addSong: addSong
}
