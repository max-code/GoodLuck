const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

resizeCanvas();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);


let squareX = 0;
const squareSize = 50;
const speed = 2; // Speed of the square

function update() {
    console.log(squareX)
    squareX += speed; // Move the square right by 'speed' pixels
    if (squareX > canvas.width) {
        squareX = -squareSize; // Reset square position when it goes off screen
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = 'blue'; // Set the fill color for the square
    ctx.fillRect(squareX, 100, squareSize, squareSize); // Draw the square
}

function gameLoop() {
    update(); // Update the game state
    draw();   // Render the game state

    requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
}

gameLoop(); // Start the game loop
