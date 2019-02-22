require('dotenv').config()
const fs = require('fs')
const path = require('path')
const parseMidi = require('midi-file').parseMidi
const getScales = require('./utils/scale').getScales
const parseScale = require('./utils/scale').parseScale
const parseNoteNumber = require('./utils/note').parseNoteNumber
const normalizeScale = require('./utils/normalize').normalizeScale
const normalizeRange = require('./utils/normalize').normalizeRange
const getFolder = require('./utils/file').getFolder
const addSong = require('./utils/api').addSong

const songName = process.argv[2]

parseSong(songName)

function parseSong(song) {
  let tracks = []
  let scales = {}
  getFolder(song).then(data => {
    fs.readdirSync(data.folder).forEach(file => {
      if (path.extname(file) == '.mid') {
        const midi = parseMidi(fs.readFileSync(`${data.folder}/${file}`))
        const notesObject = getNotes(midi)
        const notes = notesObject.notes
        const notesMap = notesObject.notesMap
        getScales(notesMap).forEach(scale => {
          scale[0] in scales ? scales[scale[0]] += 1 : scales[scale[0]] = 1
        })
        tracks.push({
          type: file.toLowerCase().includes('melody') ? 'melody' : 'bass',
          notes: notes,
          lowestNote: notes.reduce((a, b) => a.noteNumber < b.noteNumber ? a : b)
        })
      }
    })
    let bestScale = Object.keys(scales).reduce((a, b) => scales[a] > scales[b] ? a : b)
    let normalizedTracks = normalizeScale(tracks, bestScale)
    normalizedTracks = normalizeRange(normalizedTracks)
    addSong(data, tracks, normalizedTracks)
  }).catch(err => {
    console.log(err);
  })
}

function getNotes(midi) {
  const TPB = midi.header.ticksPerBeat
  let notes = []
  let notesMap = {}
  let currNotes = {}
  let absoluteTime = 0
  midi.tracks[0].map((item, index) => {
    absoluteTime += item.deltaTime
    if (item.type === 'noteOn') {
      currNotes[item.noteNumber] = item
      currNotes[item.noteNumber].startTime = absoluteTime
    } else if (item.type === 'noteOff') {
      notes.push({
        noteNumber: item.noteNumber,
        note: parseNoteNumber(item.noteNumber),
        startTime: currNotes[item.noteNumber].startTime / TPB,
        duration: (absoluteTime - currNotes[item.noteNumber].startTime) / TPB * 0.25,
        sixteenths: (absoluteTime - currNotes[item.noteNumber].startTime) / TPB * 4,
        // octave: Math.floor(item.noteNumber / 12) - 3,
      })

      let scaleNote = item.noteNumber % 12
      scaleNote in notesMap ? notesMap[scaleNote] += 1 : notesMap[scaleNote] = 1
    }
  })

  return { notes: notes, notesMap: notesMap }
}

function getIntervalsMap(notes) {
  let intervals = []
  let intervalsMap = {}
  for (let i = 1; i < notes.length; i++) {
    let interval = notes[i].noteNumber - notes[i-1].noteNumber
    intervals.push(interval)
    interval in intervalsMap ? intervalsMap[interval] += 1 : intervalsMap[interval] = 1
  }

  return intervalsMap
}

module.exports = {
  getNotes: getNotes
}
