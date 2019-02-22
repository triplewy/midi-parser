const fs = require('fs')
const path = require('path')
const parseMidi = require('midi-file').parseMidi
const expect = require('chai').expect;
const index = require('../index');
const normalize = require('../utils/normalize')

const melody = parseMidi(fs.readFileSync('/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/Venus-Flytrap(2014)/Melody.mid'))
const bass = parseMidi(fs.readFileSync('/Users/alexyu/Desktop/Sam_Gellaitry/MIDI/Venus-Flytrap(2014)/Bass.mid'))

describe('getNotes(): get midi notes from midi file', function () {
  it('TEST 1', function () {
    // 1. ARRANGE
    const notes = index.getNotes(melody)

    // 2. ACT
    const trueMidi = [
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63,
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63
    ]

    // 3. ASSERT
    expect(notes.notes.map(note => note.noteNumber)).to.be.eql(trueMidi);
  })

  it('TEST 2', function () {
    // 1. ARRANGE
    const notes = index.getNotes(bass)

    // 2. ACT
    const trueMidi = [
      44,44,44,54,44,56,
      46,46,58,46,58,46,
      39,39,49,51,39,39,41,42,
      39,39,49,51,39,39,41,42,
      44,44,44,54,44,56,
      46,46,58,46,58,46,
      39,39,49,51,39,39,41,42,
      39,39,49,51,39,39,41,42,
    ]

    // 3. ASSERT
    expect(notes.notes.map(note => note.noteNumber)).to.be.eql(trueMidi);
  })
})

describe('normalizeScale(): transpose notes to have C | a scale', function () {
  it('TEST 1', function () {
    // 1. ARRANGE
    const notes = normalize.normalizeScale([{notes: index.getNotes(melody).notes}], 1)
    // 2. ACT
    let trueMidi = [
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63,
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63
    ].map(note => note -= 1)

    // 3. ASSERT
    expect(notes[0].notes.map(note => note.noteNumber)).to.be.eql(trueMidi);
  })
})

describe('normalizeRange(): transpose notes so that lowest note is in octave 0', function () {
  it('TEST 1', function () {
    // 1. ARRANGE
    const notes = normalize.normalizeRange(normalize.normalizeScale([{notes: index.getNotes(melody).notes}], 1))
    // 2. ACT
    let trueMidi = [
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63,
      56,56,56,63,66,68,66,66,
      58,58,58,63,68,70,68,
      51,51,51,54,61,63,
      51,51,51,54,61,63
    ].map(note => note -= 49)

    // 3. ASSERT
    expect(notes[0].notes.map(note => note.noteNumber)).to.be.eql(trueMidi);
  })
})
