const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var players = {};
var playerNames = [];
var shuffling = false;

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/homePage.html');
});
app.get('/game-room', (req, res, next) => {
  res.sendFile(__dirname + '/game-room' + '/game.html');
});

app.use(express.static(__dirname));


io.on('connection', (socket) => {
  players[socket.id] = ({username: null}, {assignedPerson: null});

  // If player is joined late update ui
  io.emit('updateJoinedList', players);

  // Assign the name to player
  socket.on('choosePlayer', function(playerId, playerName){
    players[playerId].username = playerName;
    io.emit('updateJoinedList', players);
    playerNames.push(playerName);
  }
  );
  // Handles disconnect event
  socket.on('disconnect', () => {
    // Updates the player list on both the front end and back end of
    io.emit('playerDisconnected', players[socket.id].username); 
    // Removes the player from the players list when they disconnect
    delete players[socket.id];
    shuffling = false;
  }); 
  
  socket.on('assignPlayers',()=>{
    if(!shuffling){
      shuffling = true;
      const shuffledPlayers = shuffle(playerNames);
      var assignments = assignPlayers(shuffledPlayers);
      io.emit('assigningDone', assignments);
    }
  })
});

function assignPlayers(playersArray) {
  const shuffledPlayers = shuffle(playersArray);
  const assignments = {};

  const assignedTo = new Set();

  for (let i = 0; i < shuffledPlayers.length; i++) {
    let assignedPlayer;

    // Ensure no one is assigned to themselves or to someone already assigned
    do {
      assignedPlayer = shuffledPlayers[randomize(shuffledPlayers.length)];
    } while (assignedPlayer === shuffledPlayers[i] || assignedTo.has(assignedPlayer));

    assignments[shuffledPlayers[i]]  = {assignedTo: ""};
    assignments[shuffledPlayers[i]].assignedTo = assignedPlayer;
  }

  return assignments;
}

function shuffle(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomize(num){
  return Math.floor(Math.random() * num);
}


server.listen(3000, () => {
  console.log('listening on *:3000');
});