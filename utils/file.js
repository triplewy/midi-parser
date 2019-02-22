const fs = require('fs')

function getFolder(songName) {
  return new Promise(function(resolve, reject) {
    fs.readdir('/Users/alexyu/Desktop/Sam_Gellaitry/MIDI', function(err, result) {
      result.forEach(name => {
        if (fs.lstatSync(`/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/${name}`).isDirectory()) {
          const nameArray = name.split('(')
          const title = nameArray[0]
          const year = nameArray[1].substring(0, nameArray[1].length - 1)
          if (title.toLowerCase() == songName.toLowerCase()) {
            return resolve({ folder: `/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/${name}`, title: title, year: year })
          }
        }
      })
      return reject('No folder found')
    })
  })
}

module.exports = {
  getFolder: getFolder
}
