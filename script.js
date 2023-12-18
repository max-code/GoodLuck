const phrase = "testtesttesttesttesttest"; // Replace with your phrase
let currentLetterIndex = 0;
let squareDisplaySecondsTimer, delayBetweenSquaresTimer;
let showingLetter = false;
let isGameRunning = false;
let squareDisplaySeconds = 0.75;
let delayBetweenSquaresMaxSeconds = 30;
const christmasColours = [
    "#165b33",
    "#146b3a",
    "#f8b229",
    "#ea4630", 
    "#bb2528"
];

const squareSize = window.innerWidth > 600 ? 50 : 30; // Adjust size based on screen width
let x = 0;
let y = 0;

let goodLuckTextsInterval;

const activeGoodLuckTexts = []; // Array to keep track of active texts
const maxGoodLuckCount = 5; // Maximum number of texts on screen
let goodLuckTextsDisplayTimeMilliseconds = 3000;

function showSquare() {
    
    clearTimeout(delayBetweenSquaresTimer);

    if (currentLetterIndex >= phrase.length) {
        document.getElementById("result").textContent = "Well done!";
        return;
    }

    const delay = Math.random() * 1000 * delayBetweenSquaresMaxSeconds; // Random delay up to delayBetweenSquaresMaxSeconds

    delayBetweenSquaresTimer = setTimeout(() => {
        const square = document.createElement("div");
        square.className = "square";
        square.style.backgroundColor = randomChoice(christmasColours)
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
    if (event.target.className !== "square" && currentLetterIndex < phrase.length) {
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
    clearInterval(goodLuckTextsInterval);
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
    goodLuckTextsInterval = setInterval(maintainTexts, 10);
    showSquare();
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}



function createGoodLuckText() {
    if (activeGoodLuckTexts.length < maxGoodLuckCount) {
        const text = document.createElement("div");
        text.className = "good-luck";
        text.textContent = "Good Luck 👍😊👍";
        text.style.color = randomChoice(christmasColours);
        positionAndRotateText(text);
        document.body.appendChild(text);

        // Animate the text
        setTimeout(() => {
            text.style.opacity = "0.9";
            text.style.transform += " scale(2.5)";
        }, 10); // Start animation shortly after appending

        setTimeout(() => {
            text.remove();
            activeGoodLuckTexts.splice(activeGoodLuckTexts.indexOf(text), 1);
        }, Math.random() * goodLuckTextsDisplayTimeMilliseconds + 1000); // Between 1 and goodLuckTextsDisplayTimeMilliseconds + 1 seconds
    }
}

function positionAndRotateText(text) {
    const x = Math.random() * (window.innerWidth - text.clientWidth);
    const y = Math.random() * (window.innerHeight - text.clientHeight);
    const rotation = Math.random() * 360; // Random rotation between -45 to 45 degrees
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;
    text.style.transform = `rotate(${rotation}deg)`;
}

function maintainTexts() {
    // Check if more texts need to be added
    if (isGameRunning && activeGoodLuckTexts.length < maxGoodLuckCount) {
        const textsToAdd = maxGoodLuckCount - activeGoodLuckTexts.length;
        for (let i = 0; i < textsToAdd; i++) {
            createGoodLuckText();
        }
    }
}

goodLuckTextsInterval = setInterval(maintainTexts, 10);
isGameRunning = true;
showSquare();
