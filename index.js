'use strict';

const five = require('johnny-five');
const io = require('socket.io-client');
const fetch = require('node-fetch');

const host = 'http://localhost:5000';
const board = new five.Board();

let notes = {};

board.on('ready', function() {
  const led = new five.Led(13);
  const piezos = [
    new five.Piezo(11),
    new five.Piezo(10),
    new five.Piezo(9),
    new five.Piezo(6),
    new five.Piezo(5),
    new five.Piezo(3),
  ];

  // const play = (note, duration) => piezo.frequency(five.Piezo.Notes[note], duration);
  const play = (note) => {
    console.log('play', note);
  };
  const stop = (note) => {

  };

  const showNotes = () => console.log('Notes:', JSON.stringify(Object.keys(five.Piezo.Notes)));

  const socket = io.connect(host);

  socket.on('connect', () => {
    console.log('Connected');
    led.blink(500);
  });

  socket.on('notes', data => {
    Object.keys(data).forEach(note => {
      return data[note] ? play(note) : stop(note)
    });
    notes = Object.assign({}, notes, data);
  });

  fetch(`${host}/notes`)
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(note => {
        return data[note] ? play(note) : stop(note)
      });
      notes = Object.assign({}, notes, data);
    })
    .catch(console.error.bind(console));

  this.repl.inject({
    piezos,
    // play,
    showNotes,
  });
});
