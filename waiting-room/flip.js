
import {changePage,addCustomCursor} from '/utils.js';

passMemory(1);
automaticFlip = setInterval(function() {
    passMemory(++currentSlideNum);
}, 10000);

addCustomCursor();

var currentSlideNum = 1;
var imgContainer = document.querySelector('.imgContainer');

var slideCount = imgContainer.querySelectorAll('div').length;
console.log(slideCount);
var color = '#fff';
var shadowColor = "rgba(255, 255, 255, 0.8)";
var timeoutId = "";
var automaticFlip = "";
var button = document.querySelector(".arrows");
var slideChanging = false;
document.addEventListener('keydown', function(event) {
    switch(event.key) {
    //   case 'ArrowLeft':
    //     changeSlide(false);
    //     break;
      case 'ArrowRight':
        clearTimeout(timeoutId);
        clearTimeout(automaticFlip);
        arrowClick();
        // To prevent Yavuz from button smashing
        if(!slideChanging){
            slideChanging = true;
            setTimeout(function () {
                slideChanging=false;
            }, 200);
            changeSlide(true);
        }
        break;
    }
});
button.addEventListener("click", function() {
    alert("Div Clicked!");
    // Add your custom logic here
  });
function changeSlide(add){
    if(add){
        if(currentSlideNum >= slideCount-1){
            color='#400';
            shadowColor = "rgba(255, 0,0, 0.8)";
            document.querySelector(".subtext").style.opacity=1;
            makePastSlidesDissapear(slideCount-1);
        } 
        if(currentSlideNum < slideCount) currentSlideNum++;
        else{
            // When user goes back from game room they shouldn't be able to click on other slides
            setTimeout(function () {
                deleteAllPastSlides();
                history.pushState({}, null, "/game-room");
                changePage("/game-room");
            }, 4000);
        } 
    }
    console.log("current " + currentSlideNum);
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
        console.log("diss " + dissapearSlide);
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