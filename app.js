const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var players = {};

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));


io.on('connection', (socket) => {
  console.log('a user connected');

  players[socket.id] = {assignedPerson: 0, clicked: false, username: null};

  io.emit('updatePlayers', players);

  // When user clicks on spin button spinWheel event is sent from socket
  // spinWheel event triggers updateWheel on all clients
  socket.on('spinWheel', () => {
    io.emit('updateWheel', Math.ceil(Math.random() * 3600), Math.ceil(Math.random() * 3600));
  });

  // Handles reloadPage event
  socket.on('reloadPage', () => {
    io.emit('reloadAllPages'); // Broadcast to all connected clients
  });

  // Handles disconnect event
  socket.on('disconnect', () => {
    // Removes the player from the players list when they disconnect
    delete players[socket.id];
    // Updates the player list on both the front end and back end of
    io.emit('updatePlayers', players); 
  });

  socket.on('playerClicked', (playerSocketId) =>{
    console.log("player clicked");
    players[playerSocketId].clicked = true;
    io.emit('updatePlayers', players); // Change player list on front end
  })
  socket.on('assignPerson', (person, personToBeAssigned) =>{
    console.log("person " + person);
    players[person].assignedPerson = personToBeAssigned;
    
    var assignedPlayerCount = 0;
    for(var player of Object.keys(players)){
      if(players[player].assignedPerson != 0){
        assignedPlayerCount++;
      }
    }
    if(assignedPlayerCount == 3){
      console.log("last round");
      io.emit('lastRound');
    }
    io.emit('updatePlayers', players);
  })

  socket.on("nameChosen", (username)=>{
    console.log(username);
    players[socket.id].username = username;
    io.emit('updatePlayers', players);
    io.emit('newPlayer');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});