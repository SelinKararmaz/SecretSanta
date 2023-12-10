const canvas = document.getElementById('drawCanvas');
const context = canvas.getContext('2d');
const socket = io({ reconnection: false });
let isDrawing = false;

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    context.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = '#000';

    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);


document.addEventListener("DOMContentLoaded", function() {


    const displayButton = document.getElementById('saveButton');
    displayButton.addEventListener('click', displayDrawing);
    var displayedImage = document.querySelector('.image-container');


    function displayDrawing() {
        const dataURL = canvas.toDataURL(); // Get the data URL of the canvas
        socket.emit("drawingSaved", dataURL);
    }

    socket.on('someoneDrew',(url)=>{
        alert(url);
        displayedImage.style.display='block';
        displayedImage.style.backgroundImage = 'url('+url+')';
        setTimeout(1000,function(){
            displayedImage.style.display='hidden';
        })
    });
    
});
