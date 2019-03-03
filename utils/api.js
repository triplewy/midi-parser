const { db } = require("../mongo/config");

function addSong(metadata, tracks, normalizedTracks) {
  console.log(metadata);
  const filter = { name: "Sam Gellaitry" };
  const update = {
    $push: {
      songs: {
        name: metadata.title,
        year: metadata.year,
        tracks,
        normalizedTracks
      }
    }
  };
  return db.collection("artists").updateOne(filter, update);

  // return new Promise((resolve, reject) => {
  //     db.collection("artists").updateOne(
  //       {
  //         name: "Sam Gellaitry"
  //       },
  //       {
  //         $push: {
  //           songs: {
  //             name: metadata.title,
  //             year: metadata.year,
  //             tracks,
  //             normalizedTracks
  //           }
  //         }
  //       },
  //       (err, result) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         console.log(`Modified ${result.result.n}`);
  //         client.close();
  //         return resolve();
  //       }
  //     );
  //   });
  // });
}

module.exports = {
  addSong
};
