'use strict'

const five = require('johnny-five')
const io = require('socket.io-client')
const fetch = require('node-fetch')

const host = 'http://luces-api.lopezjuri.com'
const board = new five.Board()

board.on('ready', function() {
   // Setup variables
  const notes = {}
  const piezos = [
    new five.Piezo(11),
    new five.Piezo(10),
    new five.Piezo(9),
    new five.Piezo(6),
    new five.Piezo(5),
    new five.Piezo(3),
  ]

  const mapping = (note) => {
    switch (note[0]) {
      case 'c': return piezos[0]
      case 'd': return piezos[1]
      case 'e': return piezos[2]
      case 'f': return piezos[3]
      case 'g': return piezos[4]
      case 'a': return piezos[5]
      default: return null;
    }
  }

  // Setup functions
  const play = (note) => {
    const piezo = mapping(note)
    // note = note.replace('1', '6') // change tune
    if (piezo && piezo.isPlaying) piezo.noTone()
    if (piezo) piezo.frequency(five.Piezo.Notes[note], 5000)
  }
  const stop = (note) => {
    const piezo = mapping(note)
    if (piezo) piezo.noTone()
  }

  const showNotes = () => {
    console.log('Notes:', JSON.stringify(Object.keys(five.Piezo.Notes)))
  }

  /**
   * Update the current notes and lights state
   */
  const update = (data = {}) => {
    // Play or stop notes and lights
    Object.keys(data).forEach(note => {
      if (data[note]) {
        play(note)
        setTimeout(() => stop(note), 200)
      } else {
        stop(note)
      }
    })
    // Save to data store
    return Object.assign(notes, data)
  }

  /**
   * Request the application note state
   */
  // const refresh = () => fetch(`${host}/notes`)
  //   .then(res => res.json())
  //   .then(data => update(data));

  // Fetch current note state
  // refresh().catch(console.error.bind(console))

  // Setup live connection
  const socket = io.connect(host)
  socket.on('connect', () => {
    console.log('Connected')
  })
  socket.on('notes', data => update(data))

  // Setup REPL
  this.repl.inject({
    piezos,
    // play,
    showNotes,
  })
})
