import { changeButtonColor, createButton, getCountry, changePage} from '/utils.js';

// Before the content is loaded
const socket = io({ reconnection: false });

let username = sessionStorage.getItem('username');
let assignee = "";

socket.on('playerDisconnected',function(userName){
  alert(userName + " disconnected");
  changePage("/");
})
socket.emit("shufflePlayers");
document.addEventListener("DOMContentLoaded", function() {
  
  let candy = document.querySelector('.candy');

  // Player that chart chooses
  let chosenPlayerImage = document.querySelector('.chosenPlayer');
  // Santa's dialog
  let dialogContainer = document.querySelector('.santaText');
  // The family members on the chart
  let numbers = document.querySelectorAll('.number');

  let family = ["selin", "yavuz","alper","keziban" ];

  var audio = document.getElementById("music");
  var musicSource = document.getElementById('musicSource');
  let snowContainer = document.getElementById("fullPageDiv");

  var bgMusic = false;


  candy.addEventListener('mouseover', function() {
    letItSnow(1, snowContainer);
  });
  candy.addEventListener('mouseout', function() {
    letItSnow(0, snowContainer);
    graduallyPauseAudio(audio);
  });
  candy.addEventListener('click', function() {
    if(bgMusic) changeMusic("eyvaheyvah");
  });
  function changeMusic(person){
    musicSource.src = "Music/" +person+".mp3";
    // Load the new source
    audio.load();
    audio.play();
  }
  
  // Chosen member on the chart
  let choosenPerson = null;
  
  // Displays players on front end
  socket.on('updatePlayers', function(players, newPlayer) {
    members = players;
  })

  // Updates the players text
  socket.on('newPlayer', function() {
    console.log(members);
    displayPlayers(playerContainer, members);
  })


  

})


  
function changeImage(chosenPlayerImage, personName){
  chosenPlayerImage.src = "Images/"+personName+".jpg";
  console.log(chosenPlayerImage.src);
  chosenPlayerImage.style.display = "block";
  // Deletes image after 8 secs
  setTimeout(function () {
    chosenPlayerImage.style.display = "none";;
  }, 8000); 
}

function changeDialog(person, dialogContainer){
  var newParagraph = document.createElement("h1");
  var dialog = " replace";
  if(person == "selin"){
    dialog = "Bu sitenin yapimcisini sectin. Sansli secim.";
  }else if(person ==""){
    dialog = "Oyuncu kendisini secti, bir daha dene!"
  }else{
    dialog = person + " secildi!!";
  }
  dialogContainer.textContent = dialog;
}

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