// Const HTML elements
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer")
const gameOverMessage = document.getElementById("gameOverMessage")
// Game timers/variables
const phrase = "test-code"; // Replace with your phrase
let currentLetterIndex = 0;
let squareDisplayMilisecondsTimer, delayBetweenSquaresTimer;
let showingLetter = false;
let isGameRunning = false;
const activeGoodLuckTexts = [];
const maxGoodLuckTextCount = 100;
let clickCount = 0; // for easy mode enable
let startTime = 0;

// Timings
let squareDisplayMiliseconds = 600;
//let delayBetweenSquaresMaxMiliseconds = 45000;
let delayBetweenSquaresMaxMiliseconds = 1000;
let goodLuckTextsInterval;
let goodLuckTextsDisplayTimeMilliseconds = 5000;

// Style
let christmasColours = [
    "#165b33",
    "#146b3a",
    "#f8b229",
    "#ea4630", 
    "#bb2528"
];

let goodLuckTextOpacity = "1";
let goodLuckTextScale = "scale(5)";

// Positions
let squareSize = window.innerWidth > 600 ? 50 : 30; // Adjust size based on screen width
let x = 0;
let y = 0;


function makeSquareHTML()
{
    let square = document.createElement("div");
    square.className = "square";
    square.style.backgroundColor = randomChoice(christmasColours);
    return square;
}

function makeGoodLuckTextHTML()
{
    const text = document.createElement("div");
    text.className = "good-luck";
    text.textContent = "Good Luck 👍😊👍";
    text.style.color = randomChoice(christmasColours);
    return text;
}

function showSquare() {
    
    clearTimeout(delayBetweenSquaresTimer);

    if (currentLetterIndex >= phrase.length) {
        gameOver("Well Done.\nI hope you were keeping track of your Amazon code.", "green");
        return;
    }

    const delay = (Math.random() * delayBetweenSquaresMaxMiliseconds) + 1000; // Random delay above 1s and up to delayBetweenSquaresMaxMiliseconds

    delayBetweenSquaresTimer = setTimeout(() => {
        const square = makeSquareHTML();
        positionSquare(square);
        gameContainer.appendChild(square);

        // Square wasnt clicked timer
        squareDisplayMilisecondsTimer = setTimeout(() => {
            square.remove();
            gameOver("Game Over", "red");
        }, squareDisplayMiliseconds);

        if (!showingLetter){
            square.addEventListener("click", () => { // When square clicked, clear the not clicked timer and show the letter for 1 second
                clearTimeout(squareDisplayMilisecondsTimer);
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

function gameOver(gameOverText, gameOverColour) {
    clearTimeout(squareDisplayMilisecondsTimer);
    clearTimeout(delayBetweenSquaresTimer);
    clearInterval(goodLuckTextsInterval);
    gameContainer.innerHTML = "";
    gameOverContainer.style.display = "block";
    gameOverMessage.textContent = gameOverText;
    gameOverMessage.style.color = gameOverColour;
    currentLetterIndex = 0;
    showingLetter = false;
    isGameRunning = false;
}

function positionSquare(square) {
    const maxWidth = gameContainer.clientWidth - squareSize;
    const maxHeight = gameContainer.clientHeight - squareSize;
    x = Math.random() * maxWidth;
    y = Math.random() * maxHeight;
    square.style.left = `${x}px`;
    square.style.top = `${y}px`;
}


function resetGame() {
    gameContainer.innerHTML = "";
    currentLetterIndex = 0;
    isGameRunning = true;
    goodLuckTextsInterval = setInterval(maintainGoodLuckTexts, 10);
    showSquare();
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function createGoodLuckText() {
    const text = makeGoodLuckTextHTML();
    positionAndRotateGoodLuckText(text);
    document.body.appendChild(text);
    activeGoodLuckTexts.push(text);

    const goodLuckTextDisplayTime = (Math.random() * goodLuckTextsDisplayTimeMilliseconds) + 1000;

    setTimeout(() => {
        text.style.opacity = goodLuckTextOpacity;
        text.style.transform += goodLuckTextScale;
    }, 10);

    setTimeout(() => {
        text.remove();
        const index = activeGoodLuckTexts.indexOf(text);
        if (index > -1) {
            activeGoodLuckTexts.splice(index, 1);
        }

    }, goodLuckTextDisplayTime); // Between 1 and goodLuckTextsDisplayTimeMilliseconds + 1 seconds
}

function positionAndRotateGoodLuckText(text) {
    const maxWidth = gameContainer.clientWidth;
    const maxHeight = gameContainer.clientHeight;
    x = Math.random() * maxWidth;
    y = Math.random() * maxHeight;
    const rotation = Math.random() * 360; // Random rotation between -45 to 45 degrees
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;
    text.style.transform = `rotate(${rotation}deg)`;
}

function maintainGoodLuckTexts() {
    while (isGameRunning && activeGoodLuckTexts.length < maxGoodLuckTextCount) {
        createGoodLuckText();
    }
}

function start()
{
    gameContainer.addEventListener("click", function(event) {
        // Easy mode logic
        const currentTime = new Date().getTime();
        if (clickCount === 0) {
            startTime = currentTime;
        }
        clickCount++;
        if (clickCount >= 30) {
            if(currentTime - startTime <= 10000)
            {
                console.log("Easy mode enabled");
                goodLuckTextOpacity = "0.6";
                goodLuckTextScale = "scale(1.8)";
                squareDisplayMiliseconds = 1100;
                goodLuckTextsDisplayTimeMilliseconds = 3000;
                maxGoodLuckTextCount = 10;
            }
            clickCount = 0; 
        }
    
        // Game over logic
        if (event.target.className !== "square" && currentLetterIndex < phrase.length) {
            gameOver("Game Over", "red");
        }
    });
    
    document.getElementById("restartButton").addEventListener("click", function() {
        resetGame();
        gameOverContainer.style.display = "none";
    });

    // Reset the counter if 10 seconds pass
    setInterval(function() {
        const currentTime = new Date().getTime();
        if (currentTime - startTime > 10000) {
            clickCount = 0;
        }
    }, 100);

    goodLuckTextsInterval = setInterval(maintainGoodLuckTexts, 10);
    isGameRunning = true;
    showSquare();

}

start();
