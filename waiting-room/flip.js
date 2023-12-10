
import {changePage} from '/utils.js';

// Reload so that it resets the slides

document.addEventListener('DOMContentLoaded', function () {
    // Check the referrer and navigate to #slide_1 if coming from a different directory
    if (document.referrer && document.referrer.indexOf("/game-room/") === -1) {
      window.location= "#slide1";
    }
  });
passMemory(1);
setInterval(function() {
    passMemory(++currentSlideNum);
}, 8000);


var currentSlideNum = 1;
var slideCount = 7;

document.addEventListener('keydown', function(event) {
    switch(event.key) {
    //   case 'ArrowLeft':
    //     changeSlide(false);
    //     break;
      case 'ArrowRight':
        changeSlide(true);
        break;
    }
});


function changeSlide(add){
    if(add){
        if(currentSlideNum < slideCount) currentSlideNum++;
        else changePage('/game-room');
    }else{
        if(currentSlideNum != 0) currentSlideNum--;
    }
    console.log(currentSlideNum);
    simulateClick(currentSlideNum);
}


function passMemory(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
        currentSlideNum = button.id;
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        button.dispatchEvent(event);
    }
}

function simulateClick(buttonId) {
    var button = document.getElementById(buttonId);
    arrowClick();
    if (button) {
        currentSlideNum = button.id;
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        button.dispatchEvent(event);
        makePastSlidesDissapear(currentSlideNum-1);
    }
}

function makePastSlidesDissapear(index){
    while(index>0){
        makeSlideDissapear('slide_'+index);
        index--;
    }
}


function makeSlideDissapear(slideId){
    var dissapearSlide = document.getElementById(slideId);
    console.log(dissapearSlide);
    if(dissapearSlide){
            // Add a CSS transition to the element
    dissapearSlide.style.transition = 'opacity 0.5s ease'; // You can adjust the duration and timing function

    // Set the opacity to 0 to make it gradually disappear
    dissapearSlide.style.opacity = '0';
    }
}


function arrowClick(){
    var button = document.querySelector(".arrows");
    if (button) {
        console.log("yes");
        button.style.transform = 'scale(1.2)';
        button.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)'; 
        button.style.backgroundColor = '#fff'; 
        
        setTimeout(function () {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
            button.style.backgroundColor = '#000'; 
        }, 900);
    }    
}