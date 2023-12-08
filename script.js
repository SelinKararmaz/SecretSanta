// Before the content is loaded
const socket = io({ reconnection: false });

// Prompt user to enter name
let username = getUserInput();
console.log(username);
socket.emit("nameChosen", username);


// Reloads the page so that the chart stays the same when user disconnects
window.addEventListener('beforeunload', () => {
  socket.emit('reloadPage');
});
// Listen for reloadAllPages event
socket.on('reloadAllPages', () => {
  location.reload(true); // Reload the page, forcing a full reload
});

document.addEventListener("DOMContentLoaded", function() {
  let wheel = document.querySelector('.wheel');
  let spinBtn = document.querySelector('.spinBtn');
  // Players displayed on left
  let playerContainer = document.querySelector('.players');
  // Player that chart chooses
  let chosenPlayerImage = document.querySelector('.chosenPlayer');
  // Santa's dialog
  let dialogContainer = document.querySelector('.santaText');
  // The family members on the chart
  let numbers = document.querySelectorAll('.number');

  let selin = document.querySelector('#selin');
  let yavuz = document.querySelector('#yavuz');
  let alper = document.querySelector('#alper');
  let keziban = document.querySelector('#keziban');

  let family = [selin, yavuz, alper, keziban];

  var audio = document.getElementById("music");
  var source = document.getElementById('musicSource');

  var bottom = 0;
  var spinning = false;
  // members joined
  let members = {};

  // Initialize chart with 4 members
  changeChart(numbers);

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

  // Triggers spinWheel
  spinBtn.onclick = function(){ 
    handleSpinButtonClick();
  };

  getWheelCoordinates();

  // When updateWheel event is triggered, rotates wheel, 
  // Choses member, updates wheel
  socket.on('updateWheel', function(speed, factor) {
    // Bottom is not calculated yet
    if(bottom == 0){
      return;
    }

    // Rotate with given speed
    wheel.style.transform = "rotate(" + speed + "deg)";
    speed += factor;  
    spinning = true;

    // When the spin is completed
    wheel.addEventListener('transitionend', function onTransitionEnd() {
    
      for(var person of family){
        var pos = person.getBoundingClientRect();
        console.log( pos.right + " " + pos.left + " " + pos.bottom + " " + pos.top + " " + person.id);
        // Gets the person that is position on top
        if(Math.round(bottom) == Math.round(pos.bottom)){
          for(var member of Object.keys(members)){
            // If the member clicked and has not been assigned to anyone, and didn't select herself/himself
            if(members[member].clicked && members[member].assignedPerson == 0 && person.id!==members[member].username){
              updateUI(person,member);
            }
          }
          break;
        }

      }
      spinning = false;
      wheel.removeEventListener('transitionend', onTransitionEnd);
      wheel.style.transition = '';
    });

    socket.on('lastRound', () =>{
      for(var member of Object.keys(members)){
        if(members[member].assignedPerson==0){
          // Last person
          updateUI(family[0],members[member]);
          // Change the screen later
        }
      }
    })

    function updateUI(person, member){
      // Remove person from chart
      person.remove();
      numbers = document.querySelectorAll('.number');
      
      // Update wheel
      changeChart(numbers);
  
      changeMusic(audio, musicSource, person.id);
  
      changeImage(chosenPlayerImage, person.id);
  
      changeDialog(person.id, dialogContainer);

      socket.emit("assignPerson", member, person.id); // Assigns the chosen person to the user

      var assignedPlayerCount = 0;

      updateText(playerContainer, members[member].username + " - " + person.id);
    }
  });
  

  function getWheelCoordinates(){
    // CHANGE THIS WITH THE POINTING ARROW'S TOP 
    rect = spinBtn.getBoundingClientRect();
    // Bottom of the choose button
    bottom = (rect.bottom + rect.top)/2;
  }


  function handleSpinButtonClick() {
    if(Object.keys(members).length === 0){
      window.alert('The number of players is not 4!');
    } else if(members[socket.id].assignedPerson !== 0){
      window.alert('You already spinned the wheel!');
    } else if(spinning){
      window.alert('Wheel is spinning!');
    } else {
      socket.emit("playerClicked", socket.id);
      socket.emit('spinWheel');
    }
  }

})

// Draws the chart according to the member count
function changeChart(numbers){
  let numberOfElements = numbers.length;
  let angleStep = 360 / numberOfElements;

  numbers.forEach((number, index) => {
    let rotationAngle = index * angleStep;
    number.style.transform = `rotate(${rotationAngle}deg)`;
  });
}

function changeMusic(audio, source, person){
  source.src = "Music/" +person+".mp3";
  // Load the new source
  audio.load();
  audio.play();
}
  
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
  }else if(person == "yavuz"){
    dialog = "Yavuz'u sectin!!";
  }else if(person == "alper"){
    dialog = "Alper'i sectin!!";
  }else{
    dialog = "Keziban'i sectin!!";
  }
  dialogContainer.textContent = dialog;
}

function updateText(textContainer, text){
  var newParagraph = document.createElement("h2");
  newParagraph.textContent = text;
  textContainer.appendChild(newParagraph);
}

function displayPlayers(playerContainer, members){
  let text = "<h1>Current Players:</h1>";
  for(var member of Object.keys(members)){
    text += "<h2>" + members[member].username +"<h2>";
  }
  playerContainer.innerHTML = text;
}

function getUserInput(){
  console.log("yes");
  let username = prompt('Please enter your name:').toLowerCase();
  while(!["selin","alper","yavuz","keziban"].includes(username)){
    alert("Lutfen Kararmaz ailesinden bir uye sec");
    username = "";
  }
  return username;
}

