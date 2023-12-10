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

function displayDrawing() {
    const dataURL = canvas.toDataURL(); // Get the data URL of the canvas
    const displayedImage = document.querySelector('.image-container');
    displayedImage.style.backgroundImage = 'url('+dataURL+')';
    socket.emit("drawingSaved", dataURL);
    
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

const displayButton = document.getElementById('saveButton');
displayButton.addEventListener('click', displayDrawing);

socket.on('someoneDrew',url){
    alert(url);
}