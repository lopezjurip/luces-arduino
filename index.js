'use strict'

const five = require('johnny-five')
const io = require('socket.io-client')
const fetch = require('node-fetch')

const host = 'http://localhost:3000'
const board = new five.Board()

board.on('ready', function() {
   // Setup variables
  const notes = {}
  const led = new five.Led(13)
  const piezos = [
    new five.Piezo(11),
    new five.Piezo(10),
    new five.Piezo(9),
    new five.Piezo(6),
    new five.Piezo(5),
    new five.Piezo(3),
  ]

  // Setup functions
  // const play = (note, duration) => piezo.frequency(five.Piezo.Notes[note], duration)
  const play = (note) => {
    console.log('Play', note)
  }
  const stop = (note) => {
    console.log('Stop', note)
  }

  const showNotes = () => {
    console.log('Notes:', JSON.stringify(Object.keys(five.Piezo.Notes)))
  }

  /**
   * Update the current notes and lights state
   */
  const update = (data = {}) => {
    console.log('Data:', data)
    // Play or stop notes and lights
    Object.keys(data).forEach(note => (data[note] ? play(note) : stop(note)))
    // Save to data store
    return Object.assign(notes, data)
  }

  /**
   * Request the application note state
   */
  const refresh = () => {
    return fetch(`${host}/notes`)
      .then(res => res.json())
      .then(data => update(data))
  }

  // Fetch current note state
  refresh().catch(console.error.bind(console))

  // Setup live connection
  const socket = io.connect(host)
  socket.on('connect', () => {
    console.log('Connected')
    led.blink(500)
  })
  socket.on('notes', data => update(data))

  // Setup REPL
  this.repl.inject({
    piezos,
    // play,
    showNotes,
  })
})
