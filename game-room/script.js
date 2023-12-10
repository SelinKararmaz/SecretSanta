import { createButton, changeText, changeImage, changeMusic, graduallyPauseAudio, changePage, deleteImage} from '/utils.js';
import { text, family} from '/resources.js';

// Before the content is loaded
const socket = io({ reconnection: false });


document.addEventListener("DOMContentLoaded", function() {
  
  let candy = document.querySelector('.candy');
  let chosenPlayerContainer= document.querySelector('.container');
  // Santa's dialog
  let dialogContainer = document.querySelector('.santaText');

  let audio = document.getElementById("music");
  let musicSource = document.getElementById('musicSource');
  let snowContainer = document.getElementById("fullPageDiv");
  let audioImage = document.querySelector(".audioImage");
  
  let assignee = sessionStorage.getItem('assignedPerson');
  let bgMusic = 0;

  displayButtons();


  showAssignee(assignee);


  candy.addEventListener('mouseover', function() {
    letItSnow(1);
  });
  candy.addEventListener('mouseout', function() {
    letItSnow(0);
    graduallyPauseAudio(audio);
  });
  candy.addEventListener('click', function() {
    if(bgMusic == 1) {
      console.log("yes");
      changeMusic(audio, musicSource, "eyvaheyvah");
    }
  });

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
  function showAssignee(assignee){
    changeText(dialogContainer, text[assignee]);
    changeImage(chosenPlayerContainer, assignee.toLowerCase());
  }
  function letItSnow(snow){
    snowContainer.style.opacity = snow;
    bgMusic = snow;
  }
  
})




