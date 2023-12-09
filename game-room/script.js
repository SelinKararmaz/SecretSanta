import {changePage, changeText, changeImage, changeMusic} from '/utils.js';
import { text} from '/resources.js';

// Before the content is loaded
const socket = io({ reconnection: false });

let username = sessionStorage.getItem('username');
let assignee = "";
let bgMusic = 0;

setTimeout(assignPlayers,100);

function assignPlayers(){
  socket.emit("assignPlayers")
}


document.addEventListener("DOMContentLoaded", function() {
  
  let candy = document.querySelector('.candy');

  // Player that chart chooses
  let chosenPlayerText = document.querySelector('.chosenPlayer');
  let chosenPlayerContainer= document.querySelector('.container');
  // Santa's dialog
  let dialogContainer = document.querySelector('.santaText');

  let audio = document.getElementById("music");
  let musicSource = document.getElementById('musicSource');
  let snowContainer = document.getElementById("fullPageDiv");

  candy.addEventListener('mouseover', function() {
    letItSnow(1, snowContainer);
  });
  candy.addEventListener('mouseout', function() {
    letItSnow(0, snowContainer);
    graduallyPauseAudio(audio);
  });
  candy.addEventListener('click', function() {
    if(bgMusic == 1) {
      console.log("yes");
      changeMusic(audio, musicSource, "eyvaheyvah");
    }
  });

  // Displays players on front end
  socket.on('assigningDone', function(assignList) {
    assignee = assignList[username].assignedTo;
    changeText(dialogContainer, text[assignee]);
    console.log(chosenPlayerContainer);
    changeImage(chosenPlayerContainer, assignee.toLowerCase());
  })
  
})


function updateText(textContainer, text){
  var newParagraph = document.createElement("h2");
  newParagraph.textContent = text;
  textContainer.appendChild(newParagraph);
}

function displayPlayers(playerContainer, members){
  let text = "<h1>Aile Uyeleri:</h1>";
  for(var member of Object.keys(members)){
    text += "<h2>" + members[member].username +"<h2>";
  }
  playerContainer.innerHTML = text;
}

function getUserInput(){
  let username = "";
  while(username==""){
    username = prompt('Please enter your name:').toLowerCase();

    if(!["selin","alper","yavuz","keziban"].includes(username)){
      alert("Lutfen Kararmaz ailesinden bir uye sec");
      username = "";
    } 
  }
  return username;
}

function graduallyPauseAudio(audio) {
  var fadeOutInterval = setInterval(function() {
      if (audio.volume > 0.1) {
          audio.volume -= 0.1;  // decrease volume gradually
      } else {
          audio.volume = 0;
          audio.pause();
          audio.volume = 1;
          clearInterval(fadeOutInterval);
      }
  }, 200);  // adjust the interval as needed
}

function letItSnow(snow, snowContainer){
  snowContainer.style.opacity = snow;
  bgMusic = snow;
}