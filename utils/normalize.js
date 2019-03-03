const { parseNoteNumber } = require("./note");

function normalizeScale(tracks, scale) {
  return tracks.map(track => {
    const normalizedNotes = track.notes.map(note => {
      const newNote = note.noteNumber - scale;
      return {
        ...note,
        noteNumber: newNote,
        note: parseNoteNumber(newNote)
      };
    });
    return {
      type: track.type,
      notes: normalizedNotes,
      lowestNote: normalizedNotes.reduce((a, b) => (a.noteNumber < b.noteNumber ? a : b))
    };
  });
}

function normalizeRange(tracks) {
  return tracks.map(track => {
    const lowestOctave = Math.floor(track.lowestNote.noteNumber / 12);
    const normalizedNotes = track.notes.map(note => {
      const newNote = note.noteNumber - lowestOctave * 12;
      return {
        ...note,
        noteNumber: newNote,
        note: parseNoteNumber(newNote)
      };
    });
    return {
      ...track,
      notes: normalizedNotes,
      lowestNote: normalizedNotes.reduce((a, b) => (a.noteNumber < b.noteNumber ? a : b))
    };
  });
}

module.exports = {
  normalizeScale,
  normalizeRange
};
