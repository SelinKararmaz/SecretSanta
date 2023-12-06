const socket = io({ reconnection: false });

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
  
    let selin = document.querySelector('#selin');
    let yavuz = document.querySelector('#yavuz');
    let alper = document.querySelector('#alper');
    let keziban = document.querySelector('#keziban');

    var bottom = 0;
  
    let family = [selin, yavuz, alper, keziban];
    // The family members on the chart
    let numbers = document.querySelectorAll('.number');
  
    // Chosen member on the chart
    let choosenPerson = null;

    // Initialize chart with 4 members
    changeChart(numbers);

    // Triggers spinWheel
    spinBtn.onclick = function(){ 
      console.log(socket.id + " " + members[socket.id]);
      if(Object.keys(members).length != 3){
        window.alert('The number of players is not 4!');
      }else if(members[socket.id] != 0){
        window.alert('You already spinned the wheel!');
      }else{
        socket.emit('spinWheel');
      }
    };

    setTimeout(getWheelCoordinates, 2000);

    function getWheelCoordinates(){
      rect = wheel.getBoundingClientRect();
      console.log(rect.left);
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
    
          for(var person of family){
            var pos = person.getBoundingClientRect();
            console.log( pos.right + " " + pos.left + " " + pos.bottom + " " + pos.top + " " + person.id);
            // Gets the person that is position on top
            if(Math.floor(bottom) == Math.floor(pos.bottom)){
              console.log(choosenPerson);
              
              // Remove person from front end
              person.remove();
              numbers = document.querySelectorAll('.number');
              
              // Update wheel
              changeChart(numbers);
    
              // Assign person
              members[socket.id] = person.id;
              console.log(members);
              break;
            }
    
          }
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
  
