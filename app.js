const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var players = {};
var playerNames = [];
// Number of players who sent the assign players message
// Using boolean might cause sync issues, if two players send the true blue at the same time, it'll start two operations
var playerSent = 0;

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/homePage.html');
});
app.get('/game-room', (req, res, next) => {
  res.sendFile(__dirname + '/game-room' + '/game.html');
});
app.get('/waiting-room', (req, res, next) => {
  res.sendFile(__dirname + '/waiting-room' + '/waitingRoom.html');
});


app.use(express.static(__dirname));


io.on('connection', (socket) => {
  players[socket.id] = ({username: null}, {assignedPerson: null}, {isAssigned:false});

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
  socket.on('message', (message) => {
    wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
  });

  socket.on("someoneMessaged", (senderName,message)=>{
    io.emit("sendMessageToAll", senderName,message);
  })
  
  socket.on('assignPlayers',(playerCount)=>{
    playerSent++;
    console.log(playerSent);
    if(playerSent == playerCount){
      assignPlayers();
      console.log("yes");
      io.emit('assigningDone', players);
      playerSent=0;
    }
  })

  socket.on('drawingSaved',(url)=>{
    io.emit('someoneDrew',url);
  })
});

function assignPlayers() {
  var idList = Object.keys(players);
  for(var playerId of idList){
    var index = randomize(idList.length);
    console.log(index + " " + idList[index]);
    // While the assign id is not already assigned
    while(idList[index] == playerId || players[idList[index]].isAssigned==true){
      index = randomize(idList.length);
      console.log(players[playerId].username +" " + index);
      console.log(players[idList[index]]);
    }
    players[playerId].assignedPerson = players[idList[index]].username;
    players[idList[index]].isAssigned = true;
  }
  console.log(players);
  return players;
}

function randomize(num){
  return Math.floor(Math.random() * num);
}


server.listen(3000, () => {
  console.log('listening on *:3000');
});