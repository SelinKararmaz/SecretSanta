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
  res.sendFile(__dirname + '/waiting-room' + '/waiting.html');
});

app.use(express.static(__dirname + '/game-room'));
app.use(express.static(__dirname + '/waiting-room'));
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
    if(playerSent == playerCount){
      assignPlayers();
      io.emit('assigningDone', players);
      playerSent=0;
    }
  })

  socket.on('drawingSaved',(url)=>{
    io.emit('someoneDrew',url);
  })
});

// function assignPlayers() {
//   var idList = Object.keys(players);
//   var assignedCount = 0;
//   for(var playerId of idList){
//     var index = randomize(idList.length);
//     // While the assign id is not already assigned
//     while(idList[index] == playerId || players[idList[index]].isAssigned==true){
//       // For the rare case where the 3 members are assigned to different people and the 1 member is assigned to themselves
//       if(assignedCount==playerNames.length-1 && idList[index] == playerId){
//         cleanPlayers();
//         assignPlayers();
//       }
//       index = randomize(idList.length);
//     }
//     players[playerId].assignedPerson = players[idList[index]].username;
//     players[idList[index]].isAssigned = true;
//     assignedCount++;
//   }
//   console.log(players);
// }

// function cleanPlayers(){
//   for(var element of Object.keys(players)){
//     players[element].isAssigned = false;
//   }
// }
// function randomize(num){
//   return Math.floor(Math.random() * num);
// }

function assignPlayers() {
  var userIds = Object.keys(players);
  const randomList = shuffle(userIds);

  for (let i = 0; i < userIds.length-1; i++) {
    let assigneeId = randomList[i+1];
    players[userIds[i]].assignedPerson = players[assigneeId].username;
  }
  players[randomList[randomList.length-1]].assignedPerson = players[randomList[0]].username;
  console.log(players);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


server.listen(3000, () => {
  console.log('listening on *:3000');
});