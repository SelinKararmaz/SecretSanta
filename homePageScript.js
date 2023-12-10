import { changeButtonColor, createButton, getCountry, changePage,deleteImage, addShadow} from './utils.js';
import { colors, family} from './resources.js';

const socket = io({ reconnection: false });
let username = "";

reloadPage();

document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

socket.on('sendMessageToAll', function(senderName,message){
    if(username!=senderName){
        alert(senderName + " size bir mesaj yolladi: " + message);
    }
})
function choosePlayer(button) {
    if(username!="") return;
    
    changeButtonColor(button, colors.black);
    addShadow(button, "rgba(255,255,255)", "3em")
    deleteImage(button);
    button.disabled = true;
    username = button.textContent;

    // Assign the name to the player
    socket.emit("choosePlayer", socket.id, button.textContent);
}

document.addEventListener("DOMContentLoaded", function () {
    getCountry();

    var buttonContainer = document.querySelector('.buttons');
    var moon = document.querySelector('.moon');

    moon.addEventListener("click", function() {
        if(username==null || username==""){
            alert("Once bir isim secmelisin");
            return;
        }
        let message = prompt('Baskalarina ne soylemek istersin?').toLowerCase();
        socket.emit("someoneMessaged",username, message);
    });

    for (var member of family) {
        var button = createButton(buttonContainer, member);
        button.addEventListener("click", createButtonClickHandler(button));
        button.addEventListener("mouseover", createButtonMouseOverHandler(button));
        button.addEventListener("mouseout", createButtonMouseOutHandler(button));
    }

    function createButtonClickHandler(button) {
        return function () {
            choosePlayer(button);
        };
    }
    function createButtonMouseOverHandler(button) {
        return function () {
            button.style.backgroundImage = "url(game-room/Images/"+button.textContent.toLowerCase() +"-icon.jpg)";
            button.style.backgroundSize = "cover";
            addShadow(button, "rgba(255,255,255)", "3em");
            button.style.transition = "box-shadow 0.3s ease";
        };
    }

    function createButtonMouseOutHandler(button){
        return function () {
            deleteImage(button);
            // User hasn't chosen box
            if(button.textContent != username || username==""){
                button.style.boxShadow = "";
            }
        };
    }
    const magnifyTextElements = document.querySelectorAll('.magnify-text');

    magnifyTextElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.style.transform = 'scale(1.5)'; // Adjust the scale factor as needed
            element.style.color = colors.red;
        });

        element.addEventListener('mouseout', () => {
            element.style.transform = 'scale(1)';
        });
    });
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
                changeButtonColor(button, colors.black);
                button.disabled = true;
            }
        }

        // Check if everyone chose names
        if(playerList[player].username != null) chosenNames++;
        console.log("wha " + chosenNames);
        if(chosenNames == 4){
            socket.emit('assignPlayers',4);
        }
    }
}

socket.on("assigningDone", (players)=>{
    // Needs to be sent as session storage since the socket id changes when the page is changed
    sessionStorage.setItem('assignedPerson', players[socket.id].assignedPerson);
    changePage("waiting-room");
})

socket.on("updateJoinedList", function (players) {
    updateUI(players);
});

socket.on("playerDisconnected", function (disconnectedName) {
    console.log("player disconnected");
    var button = document.getElementById(disconnectedName);
    // if the player has chosen a button
    if(button){
        changeButtonColor(button, colors.blue);
        // For players who have not chosen the button, set disabled to false
        button.disabled = false;
    }

});

function reloadPage(){
    const waitTime = 2 * 60 * 1000;
    setTimeout(function() {
    location.reload(); 
    }, waitTime);
}