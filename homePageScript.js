import { changeButtonColor, createButton, getCountry, changePage} from './utils.js';
import { colors} from './colors.js';

const socket = io({ reconnection: false });
let family = ["Selin", "Alper", "Yavuz", "Keziban"];
let username = "";

function choosePlayer(button) {
    if(username!="") return;
    
    changeButtonColor(button, colors.black);
    button.disabled = true;
    username = button.textContent;

    // Assign the name to the player
    socket.emit("choosePlayer", socket.id, button.textContent);
}

document.addEventListener("DOMContentLoaded", function () {
    getCountry();

    var buttonContainer = document.querySelector('.buttons');

    for (var member of family) {
        var button = createButton(buttonContainer, member);
        button.addEventListener("click", createButtonClickHandler(button));
    }

    function createButtonClickHandler(button) {
        return function () {
            choosePlayer(button);
        };
    }
})

function updateUI(playerList) {
    var chosenNames = 0;

    for (var player of Object.keys(playerList)) {
        // Make selected buttons grey
        var buttonId = playerList[player].username;
        var button = document.getElementById(buttonId);
        
        // If it's not the player, the newly joined player's user name is null
        if (player != socket.id) {
            if(button){
                changeButtonColor(button, colors.grey);
                button.disabled = true;
            }
        }

        // Check if everyone chose names
        if(playerList[player].username != null) chosenNames++;
        if(chosenNames == 3){
            sessionStorage.setItem('username', username);
            changePage("game-room");
        }
    }
}

socket.on("updateJoinedList", function (players) {
    updateUI(players);
});

socket.on("playerDisconnected", function (disconnectedName) {
    var button = document.getElementById(disconnectedName);
    changeButtonColor(button, colors.blue);
    // For players who have not chosen the button, set disabled to false
    button.disabled = false;
});