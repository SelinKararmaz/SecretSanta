const socket = io({ reconnection: false });
var spinning = false;

let username = "";
while(username === "" || username===null){
  username = prompt('Please enter your name:');
}

// members joined
let members = {};

// Displays players on front end
socket.on('updatePlayers', function(players) {
  console.log(players);
  members = players;
})

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
    let playerContainer = document.querySelector('.players');
    let chosenPlayerImage = document.querySelector('.chosenPlayer');
    let dialogContainer = document.querySelector('.santaText');
  
    let selin = document.querySelector('#selin');
    let yavuz = document.querySelector('#yavuz');
    let alper = document.querySelector('#alper');
    let keziban = document.querySelector('#keziban');

    var audio = document.getElementById("music");
    var source = document.getElementById('musicSource');

    var bottom = 0;
  
    let family = [selin, yavuz, alper, keziban];
    // The family members on the chart
    let numbers = document.querySelectorAll('.number');
  
    // Chosen member on the chart
    let choosenPerson = null;

    // Initialize chart with 4 members
    changeChart(numbers);

    addPlayerText(username, playerContainer);

    // Triggers spinWheel
    spinBtn.onclick = function(){ 
      if(Object.keys(members).length == 0){
        window.alert('The number of players is not 4!');
      }else if(members[socket.id].assignedPerson != 0){
        console.log(members);
        window.alert('You already spinned the wheel!');
      }else if(spinning){
        window.alert('Wheel is spinning!');
      }else{
        socket.emit("playerClicked", socket.id, username);
        socket.emit('spinWheel');
      }
    };

    // Timeout is needed in order to get the most accurate coordinates on all devices
    setTimeout(getWheelCoordinates, 2000);

    function getWheelCoordinates(){
      rect = wheel.getBoundingClientRect();
      bottom = (rect.bottom + rect.top)/2
    }

    // When updateWheel event is triggered, rotates wheel, 
    // choses member, updates wheel
    socket.on('updateWheel', function(speed, factor) {
      if(bottom == 0){
        return;
      }

        // Rotate with given speed
        wheel.style.transform = "rotate(" + speed + "deg)";
        speed += factor;  

        // When the spin is completed deletes chosen person
        wheel.addEventListener('transitionend', function onTransitionEnd() {
          spinning = true;
          for(var person of family){
            var pos = person.getBoundingClientRect();
            console.log( pos.right + " " + pos.left + " " + pos.bottom + " " + pos.top + " " + person.id);
            // Gets the person that is position on top
            if(Math.floor(bottom) == Math.floor(pos.bottom)){
              console.log(choosenPerson);
              
              for(var member of Object.keys(members)){
                if(members[member].clicked && members[member].assignedPerson == 0 && person.id!==username){
                  // Remove person from front end
                  person.remove();
                  numbers = document.querySelectorAll('.number');
                  
                  // Update wheel
                  changeChart(numbers);

                  changeMusic(audio, musicSource, person.id);

                  changeImage(chosenPlayerImage, person.id);

                  changeDialog(person.id, dialogContainer);

                  socket.emit("assignPerson", member, person.id);
                  addPlayerText(username + " - " + person.id, playerContainer);
                }
              }
              break;
            }
    
          }
          spinning = false;
        //  header.textContent = members[socket.id].userName + " " + members[socket.id].assignedPerson;
          wheel.removeEventListener('transitionend', onTransitionEnd);
          wheel.style.transition = '';
        });
    });

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
  console.log("ys");
  // Load the new source
  audio.load();
  audio.play();
}
  

function addPlayerText(playerName, playerContainer){
  var newParagraph = document.createElement("h2");
  newParagraph.textContent = playerName;
  playerContainer.appendChild(newParagraph);
}

function changeImage(chosenPlayerImage, personName){
  chosenPlayerImage.src = "Images/"+personName+".jpg";
  console.log(chosenPlayerImage.src);
  chosenPlayerImage.style.display = "block";
  setTimeout(function () {
    chosenPlayerImage.style.display = "none";
    console.log("mmm");
  }, 8000); 
}

function changeDialog(person, dialogContainer){
  var newParagraph = document.createElement("h1");
  var dialog = " replace";
  if(person == "selin"){
    dialog = " Bu sitenin yapimcisini sectin. Sansli secim.";
  }
  dialogContainer.textContent = dialog;

}