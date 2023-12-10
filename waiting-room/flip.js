
import {changePage} from '/utils.js';

passMemory(1);
setInterval(function() {
    passMemory(++currentSlideNum);
}, 8000);


var currentSlideNum = 1;
var slideCount = 7;
var color = '#fff';
var shadowColor = "rgba(255, 255, 255, 0.8)";
var timeoutId = "";

document.addEventListener('keydown', function(event) {
    switch(event.key) {
    //   case 'ArrowLeft':
    //     changeSlide(false);
    //     break;
      case 'ArrowRight':
        clearTimeout(timeoutId);
        arrowClick();
        changeSlide(true);
        break;
    }
});


function changeSlide(add){
    if(add){
        if(currentSlideNum >= slideCount-1){
            color='#400';
            shadowColor = "rgba(255, 0,0, 0.8)";
        } 
        if(currentSlideNum < slideCount) currentSlideNum++;
        else{
            // When user goes back from game room they shouldn't be able to click on other slides
            //changePage('/game-room');
            setTimeout(function () {
                deleteAllPastSlides();
            }, 1200);
        } 
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

function deleteAllPastSlides(){
    // We want the first slide to stay
    while(slideCount>=1){
        deleteSlide('slide_'+slideCount);
        slideCount--;
    }
}

function deleteSlide(slideId){
    var dissapearSlide = document.getElementById(slideId);
    if(dissapearSlide){
        console.log(dissapearSlide);
    // Set the opacity to 0 to make it gradually disappear
    dissapearSlide.remove();
    }
}

function makeSlideDissapear(slideId){
    var dissapearSlide = document.getElementById(slideId);
    if(dissapearSlide){
            // Add a CSS transition to the element
    dissapearSlide.style.transition = 'opacity 0.5s ease'; // You can adjust the duration and timing function

    // Set the opacity to 0 to make it gradually disappear
    dissapearSlide.style.opacity = '0';
    }
}


function arrowClick(){
    // Reset the button each time it is clicked
    var button = document.querySelector(".arrows");
    if (button) {
        console.log("yes");
        button.style.transform = 'scale(1.2)';
        button.style.boxShadow = '0 0 30px ' + shadowColor; 
        button.style.backgroundColor = color; 
        
        timeoutId = setTimeout(function () {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
            button.style.backgroundColor = '#000'; 
        }, 900);
    }    
}