'use strict';

const five = require('johnny-five');
const io = require('socket.io-client');

const host = 'http://localhost:5000';
const board = new five.Board();

board.on('ready', function() {
  const led = new five.Led(13);

  const socket = io.connect(host);

  socket.on('connect', function() {
    console.log('Connected');
    led.blink(500);
  });
});
