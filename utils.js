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
}

export function changeMusic(audio, musicSource, person){
    musicSource.src = "Music/" +person+".mp3";
    // Load the new source
    audio.load();
    audio.play();
}