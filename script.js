const phrase = "test"; // Replace with your phrase
let currentLetterIndex = 0;
let squareDisplaySecondsTimer, delayBetweenSquaresTimer;
let showingLetter = false;
let isGameRunning = false;
let squareDisplaySeconds = 1.5;
let delayMaxSeconds = 1;


const squareSize = window.innerWidth > 600 ? 50 : 30; // Adjust size based on screen width
let x = 0;
let y = 0;

function showSquare() {
    
    clearTimeout(delayBetweenSquaresTimer);

    if (currentLetterIndex >= phrase.length) {
        document.getElementById("result").textContent = "Well done!";
        return;
    }

    const delay = Math.random() * 1000 * delayMaxSeconds; // Random delay up to delayMaxSeconds

    delayBetweenSquaresTimer = setTimeout(() => {
        const square = document.createElement("div");
        square.className = "square";
        positionSquare(square);
        document.getElementById("gameContainer").appendChild(square);

        squareDisplaySecondsTimer = setTimeout(() => {
            square.remove();
            gameOver();
        }, squareDisplaySeconds * 1000);

        if (!showingLetter){
            square.addEventListener("click", () => {
                clearTimeout(squareDisplaySecondsTimer);
                if (!showingLetter){
                    square.textContent = phrase[currentLetterIndex];
                    currentLetterIndex++;
                    showingLetter = true;
                    setTimeout(() => {
                        square.remove();
                        showSquare();
                        showingLetter = false;
                    }, 1000);
                }

            });
        }
    }, delay);
}

document.getElementById("gameContainer").addEventListener("click", function(event) {
    if (event.target.className !== "square") {
        gameOver();
    }
});

document.getElementById("restartButton").addEventListener("click", function() {
    resetGame();
    document.getElementById("gameOverContainer").style.display = "none";
});

function gameOver() {
    clearTimeout(squareDisplaySecondsTimer);
    clearTimeout(delayBetweenSquaresTimer);
    document.getElementById("gameContainer").innerHTML = "";
    document.getElementById("gameOverContainer").style.display = "block";
    currentLetterIndex = 0;
    showingLetter = false;
    isGameRunning = false;
}

function positionSquare(square) {
    const gameContainer = document.getElementById("gameContainer");
    // const squareSize = window.innerWidth > 600 ? 50 : 300; // Adjust size based on screen width
    const maxWidth = gameContainer.clientWidth - squareSize;
    const maxHeight = gameContainer.clientHeight - squareSize;
    x = Math.random() * maxWidth;
    y = Math.random() * maxHeight;
    square.style.left = `${x}px`;
    square.style.top = `${y}px`;
}


function resetGame() {
    clearTimeout(delayBetweenSquaresTimer);
    clearTimeout(squareDisplaySecondsTimer);
    document.getElementById("gameContainer").innerHTML = "";
    currentLetterIndex = 0;
    isGameRunning = true;
    setRandomDelayForGoodLuckTexts();
    showSquare();
}

isGameRunning = true;
showSquare();


function showGoodLuckTexts() {
    if(currentLetterIndex < phrase.length && isGameRunning){
        for (let i = 0; i < 3; i++) {
            createGoodLuckText();
        }
        setRandomDelayForGoodLuckTexts();
    }
}

function createGoodLuckText() {
    const text = document.createElement("div");
    text.className = "good-luck";
    text.textContent = "Good Luck 👍😊👍";
    positionAndRotateText(text);
    document.body.appendChild(text);

    // Animate the text
    setTimeout(() => {
        text.style.opacity = "1";
        text.style.transform += " scale(1.5)";
    }, 10); // Start animation shortly after appending

    // Remove the text after animation
    setTimeout(() => {
        text.remove();
    }, 1000); // Adjust time as needed
}

function positionAndRotateText(text) {
    const x = Math.random() * (window.innerWidth - text.clientWidth);
    const y = Math.random() * (window.innerHeight - text.clientHeight);
    const rotation = Math.random() * 90 - 45; // Random rotation between -45 to 45 degrees
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;
    text.style.transform = `rotate(${rotation}deg)`;
}

function setRandomDelayForGoodLuckTexts() {
    const delay = Math.random() * 500; // Random delay up to 5 seconds
    setTimeout(showGoodLuckTexts, delay);
}

setRandomDelayForGoodLuckTexts(); // Start the first appearance with a delay
