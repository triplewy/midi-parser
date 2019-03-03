const minorScales = [];
const majorScales = [];

for (let i = 0; i < 12; i += 1) {
  minorScales.push([0, 2, 3, 5, 7, 8, 10].map(item => (item + i) % 12));
  majorScales.push([0, 2, 4, 5, 7, 9, 11].map(item => (item + i) % 12));
}

function getScales(notesMap) {
  let scales = majorScales;
  Object.keys(notesMap).forEach(note => {
    scales = scales.filter(scale => scale.includes(parseInt(note, 10)));
  });
  return scales;
}

function parseScale(scaleRoot) {
  switch (scaleRoot % 12) {
    case 0:
      return "C | a";
    case 1:
      return "C# | a#";
    case 2:
      return "D | b";
    case 3:
      return "D# | c";
    case 4:
      return "E | c#";
    case 5:
      return "F | d";
    case 6:
      return "F# | d#";
    case 7:
      return "G | e";
    case 8:
      return "G# | f";
    case 9:
      return "A | f#";
    case 10:
      return "A# | g";
    case 11:
      return "B | g#";
    default:
      return "C | a";
  }
}

module.exports = {
  getScales,
  parseScale
};
