let phrase;
async function loadPhrase() {
    try {
        const response = await fetch('code.txt');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        const p = data.trim();
        return p;
    } catch (error) {
        console.error('Error fetching the file:', error);
    }
}

window.onload = function() {
    const password = "GoodLuck"; 
    let userInput = prompt("Password:");
    if (userInput === password) {
        setTimeout(() => {
        }, 500);
        start(); 
    } else {
    }
};
start()

// Const HTML elements
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer")
const gameOverMessage = document.getElementById("gameOverMessage")
const gameOverButton = document.getElementById("restartButton")
// Game timers/variables
let currentLetterIndex = 0;
let squareDisplayMilisecondsTimer, delayBetweenSquaresTimer;
let showingLetter = false;
let isGameRunning = false;
const activeGoodLuckTexts = [];
let maxGoodLuckTextCount;
if (window.innerWidth > 600) {
    maxGoodLuckTextCount = 505;
} else {
    maxGoodLuckTextCount = 50;
}
let clickCount = 0; // for easy mode enable
let startTime = 0;
let goodLuckTextWidth = 400;
let goodLuckTextHeight = 60;

// Timings
let squareDisplayMilisecondsBase = 1100;
let squareDisplayReductionFactor = 45;
let delayBetweenSquaresMaxMiliseconds = 30000;
//let delayBetweenSquaresMaxMiliseconds = 1000;
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

let goodLuckTextScale = "scale(2)";

// Positions
let squareSize = window.innerWidth > 600 ? 50 : 35; // Adjust size based on screen width
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

function setGoodLuckTextWidthAndHeight()
{
    let text = makeGoodLuckTextHTML();
    document.body.appendChild(text); // Append to DOM
    goodLuckTextWidth = text.clientWidth; // Get width
    goodLuckTextHeight = text.clientHeight;
    document.body.removeChild(text); // Remove if not needed
}

function showSquare() {
    
    clearTimeout(delayBetweenSquaresTimer);

    if (currentLetterIndex >= phrase.length) {
        gameOver("Well Done. I hope you were keeping track of your Netflix code.", "green");
        return;
    }

    const delay = (Math.random() * delayBetweenSquaresMaxMiliseconds) + 1000; // Random delay above 1s and up to delayBetweenSquaresMaxMiliseconds

    delayBetweenSquaresTimer = setTimeout(() => {
        const square = makeSquareHTML();
        positionSquare(square);
        gameContainer.appendChild(square);

        let squareDisplayTime = squareDisplayMilisecondsBase - (currentLetterIndex*squareDisplayReductionFactor);
        console.log("Showing square for ", squareDisplayTime)
        // Square wasnt clicked timer
        squareDisplayMilisecondsTimer = setTimeout(() => {
            square.remove();
            gameOver("Game Over", "red");
        }, squareDisplayTime);

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
    gameOverButton.style.backgroundColor = gameOverColour;
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
    const maxWidth = gameContainer.clientWidth - goodLuckTextWidth/2;
    const maxHeight = gameContainer.clientHeight - goodLuckTextHeight/2;
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

async function start()
{

    // Call the function
    await loadPhrase().then(p => {
        phrase = p;
    });

    gameContainer.addEventListener("click", function(event) {
        // Easy mode logic
        //console.log("code: ", phrase);
        const currentTime = new Date().getTime();
        if (clickCount === 0) {
            startTime = currentTime;
        }
        clickCount++;
        if (clickCount >= 30) {

            if(currentTime - startTime <= 10000)
            {
                goodLuckTextScale = "scale(1.8)";
                squareDisplayMilisecondsBase = 1100;
                squareDisplayReductionFactor = 30;
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

    setGoodLuckTextWidthAndHeight();
    goodLuckTextsInterval = setInterval(maintainGoodLuckTexts, 10);
    isGameRunning = true;
    showSquare();

}
