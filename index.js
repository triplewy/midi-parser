require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { parseMidi } = require("midi-file");
const { getScales } = require("./utils/scale");
// const { parseScale } = require("./utils/scale");
const { parseNoteNumber } = require("./utils/note");
const { normalizeScale } = require("./utils/normalize");
const { normalizeRange } = require("./utils/normalize");
const { getFolder } = require("./utils/file");
const { addSong } = require("./utils/api");

const songName = process.argv[2];

function getNotes(midi) {
  const TPB = midi.header.ticksPerBeat;
  const notes = [];
  const notesMap = {};
  const currNotes = {};
  let absoluteTime = 0;
  midi.tracks[0].forEach(item => {
    absoluteTime += item.deltaTime;
    if (item.type === "noteOn") {
      currNotes[item.noteNumber] = item;
      currNotes[item.noteNumber].startTime = absoluteTime;
    } else if (item.type === "noteOff") {
      notes.push({
        noteNumber: item.noteNumber,
        note: parseNoteNumber(item.noteNumber),
        startTime: currNotes[item.noteNumber].startTime / TPB,
        duration: ((absoluteTime - currNotes[item.noteNumber].startTime) / TPB) * 0.25,
        sixteenths: ((absoluteTime - currNotes[item.noteNumber].startTime) / TPB) * 4
        // octave: Math.floor(item.noteNumber / 12) - 3,
      });

      const scaleNote = item.noteNumber % 12;
      if (scaleNote in notesMap) {
        notesMap[scaleNote] += 1;
      } else {
        notesMap[scaleNote] = 1;
      }
    }
  });

  return { notes, notesMap };
}

function parseSong(song) {
  const tracks = [];
  const scales = {};
  getFolder(song)
    .then(data => {
      fs.readdirSync(data.folder).forEach(file => {
        if (path.extname(file) === ".mid") {
          const midi = parseMidi(fs.readFileSync(`${data.folder}/${file}`));
          const notesObject = getNotes(midi);
          const { notes } = notesObject;
          const { notesMap } = notesObject;
          getScales(notesMap).forEach(scale => {
            if (scale[0] in scales) {
              scales[scale[0]] += 1;
            } else {
              scales[scale[0]] = 1;
            }
          });
          tracks.push({
            type: file.toLowerCase().includes("melody") ? "melody" : "bass",
            notes,
            lowestNote: notes.reduce((a, b) => (a.noteNumber < b.noteNumber ? a : b))
          });
        }
      });
      const bestScale = Object.keys(scales).reduce((a, b) => (scales[a] > scales[b] ? a : b));
      let normalizedTracks = normalizeScale(tracks, bestScale);
      normalizedTracks = normalizeRange(normalizedTracks);
      addSong(data, tracks, normalizedTracks);
    })
    .catch(err => {
      console.log(err);
    });
}

parseSong(songName);

// function getIntervalsMap(notes) {
//   const intervals = [];
//   const intervalsMap = {};
//   for (let i = 1; i < notes.length; i++) {
//     const interval = notes[i].noteNumber - notes[i - 1].noteNumber;
//     intervals.push(interval);
//     interval in intervalsMap ? intervalsMap[interval] += 1 : intervalsMap[interval] = 1;
//   }
//
//   return intervalsMap;
// }

module.exports = {
  getNotes
};
