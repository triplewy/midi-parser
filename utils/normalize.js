const parseNoteNumber = require('./note').parseNoteNumber

function normalizeScale(tracks, scale) {
  return tracks.map(track => {
    let normalizedNotes = track.notes.map(note => {
      let newNote = note.noteNumber - scale
      return {
        ...note,
        noteNumber: newNote,
        note: parseNoteNumber(newNote)
      }
    })
    return {
      type: track.type,
      notes: normalizedNotes,
      lowestNote: normalizedNotes.reduce((a, b) => a.noteNumber < b.noteNumber ? a : b)
    }
  })
}

function normalizeRange(tracks) {
  return tracks.map(track => {
    let lowestOctave = Math.floor(track.lowestNote.noteNumber / 12)
    let normalizedNotes = track.notes.map(note => {
      let newNote = note.noteNumber - (lowestOctave * 12)
      return {
        ...note,
        noteNumber: newNote,
        note: parseNoteNumber(newNote)
      }
    })
    return {
      ...track,
      notes: normalizedNotes,
      lowestNote: normalizedNotes.reduce((a, b) => a.noteNumber < b.noteNumber ? a : b)
    }
  })
}

module.exports = {
  normalizeScale: normalizeScale,
  normalizeRange: normalizeRange
}
