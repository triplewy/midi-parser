const fs = require("fs");
const { promisfy } = require("util");

const readdir = promisfy(fs.readdir);

async function getFolder(songName) {
  try {
    const result = readdir("/Users/alexyu/Desktop/Sam_Gellaitry/MIDI");
    for (let i = 0; i < result.length; i += 1) {
      const name = result[i];
      if (fs.lstatSync(`/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/${name}`).isDirectory()) {
        const nameArray = name.split("(");
        const title = nameArray[0];
        const year = nameArray[1].substring(0, nameArray[1].length - 1);
        if (title.toLowerCase() === songName.toLowerCase()) {
          return { folder: `/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/${name}`, title, year };
        }
      }
    }
    return "No folder found";
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getFolder
};
