export function changeButtonColor(button, color){
    button.style.backgroundColor = color;
}

export function createButton(buttonContainer, name){
    var button = document.createElement("button");
    button.textContent = name;
    button.id = name;
    buttonContainer.appendChild(button);
    return button;
}

export function getCountry() {
    const userLanguage = navigator.language || navigator.userLanguage;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log('Language:', userLanguage);
    console.log('Timezone:', userTimezone);
}

export function changePage(pathname){
    window.location.pathname = pathname;
}

export function changeText(textContainer, text){
    textContainer.textContent = text;
}

  
export function changeImage(chosenPlayerContainer, personName){
    var path = "./Images/"+personName+".jpg";
    chosenPlayerContainer.style.backgroundImage = "url("+path+")";
    chosenPlayerContainer.style.backgroundSize = "cover";
}

export function deleteImage(chosenPlayerContainer){
    chosenPlayerContainer.style.backgroundImage = "";
}


export function changeMusic(audio, musicSource, person){
    musicSource.src = "Music/" +person+".mp3";
    // Load the new source
    audio.load();
    audio.play();
}

export function getButtonColor(button){
    return window.getComputedStyle(button).backgroundColor;
}

export function graduallyPauseAudio(audio) {
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
  

export function addShadow(button, rgba, area){
    button.style.boxShadow = "0 0 " +area+" " + rgba;
}