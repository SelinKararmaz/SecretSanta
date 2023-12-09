import { createButton, changeText, changeImage, changeMusic, graduallyPauseAudio, changePage, deleteImage} from '/utils.js';
import { text, family} from '/resources.js';

// Before the content is loaded
const socket = io({ reconnection: false });

let username = sessionStorage.getItem('username');
let assignee = "";
let bgMusic = 0;

setTimeout(assignPlayers,200);

function assignPlayers(){
  socket.emit("assignPlayers")
}

document.addEventListener("DOMContentLoaded", function() {
  
  let candy = document.querySelector('.candy');
  let chosenPlayerContainer= document.querySelector('.container');
  // Santa's dialog
  let dialogContainer = document.querySelector('.santaText');

  let audio = document.getElementById("music");
  let musicSource = document.getElementById('musicSource');
  let snowContainer = document.getElementById("fullPageDiv");
  let audioImage = document.querySelector(".audioImage");

  displayButtons();

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
    if(assignList[username] == null){
      console.log("time out");
      changePage('/');
    }
    assignee = assignList[username].assignedTo;
    if(assignee == null || assignee == ""){
      console.log("time out");
      changePage('/');
    }
    console.log(assignee);
    changeText(dialogContainer, text[assignee]);
    changeImage(chosenPlayerContainer, assignee.toLowerCase());
  })
  function displayButtons(){
    var buttonContainer = document.querySelector('.buttonContainer');
  
    for (var member of family) {
      var button = createButton(buttonContainer, member);
      button.addEventListener("click", createButtonClickHandler(button));
      buttonContainer.appendChild(button);
    }
    
  }
  function createButtonClickHandler(button) {
    return function () {
      choosePlayer(button);
    };
  }
  function choosePlayer(button){
    changeMusic(audio, musicSource, button.textContent);
    changeImage(button, button.textContent);
  }
})


function letItSnow(snow, snowContainer){
  snowContainer.style.opacity = snow;
  bgMusic = snow;
}

