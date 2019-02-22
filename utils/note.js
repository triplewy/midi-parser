function parseNoteNumber(noteNumber) {
  const octave = Math.floor(noteNumber / 12)
  switch (noteNumber % 12) {
    case 0: return `C${octave}`
    case 1: return `C#${octave}`
    case 2: return `D${octave}`
    case 3: return `D#${octave}`
    case 4: return `E${octave}`
    case 5: return `F${octave}`
    case 6: return `F#${octave}`
    case 7: return `G${octave}`
    case 8: return `G#${octave}`
    case 9: return `A${octave}`
    case 10: return `A#${octave}`
    case 11: return `B${octave}`
    default: return `C${octave}`
  }
}

module.exports = {
  parseNoteNumber: parseNoteNumber
}
