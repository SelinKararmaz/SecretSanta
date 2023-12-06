const socket = io({ reconnection: false });

// Displays players on front end
socket.on('updatePlayers', function(players) {
    console.log(players);
    members = players;
})

// Reloads the page so that the chart stays the same when user disconnects
socket.on('reloadPage', function () {
    window.location.reload();
});

document.addEventListener("DOMContentLoaded", function() {
    let wheel = document.querySelector('.wheel');
    let spinBtn = document.querySelector('.spinBtn');
  
    let selin = document.querySelector('#selin');
    let yavuz = document.querySelector('#yavuz');
    let alper = document.querySelector('#alper');
    let keziban = document.querySelector('#keziban');
  
    let family = [selin, yavuz, alper, keziban];
    // The family members on the chart
    let numbers = document.querySelectorAll('.number');
  
    // Chosen member on the chart
    let choosenPerson = null;

    // members joined
    let members = {};

    // Initialize chart with 4 members
    changeChart(numbers);

    // Triggers spinWheel
    spinBtn.onclick = function(){ 
        socket.emit('spinWheel');
        console.log("yes");
    };

    var rect = wheel.getBoundingClientRect();

    const bottom = (rect.bottom + rect.top)/2
    console.log(rect.right + " " + rect.left + " " + rect.bottom + " " + rect.top);

    // When updateWheel event is triggered, rotates wheel, 
    // choses member, updates wheel
    socket.on('updateWheel', function(speed, factor) {

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
  
