const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  // When user clicks on spin button spinWheel event is sent from socket
  // spinWheel event triggers updateWheel on all clients
  socket.on('spinWheel', () => {
    io.emit('updateWheel', Math.ceil(Math.random() * 3600), Math.ceil(Math.random() * 3600));
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
