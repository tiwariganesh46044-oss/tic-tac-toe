// ==========================================
// TIC TAC TOE - GAME LOGIC
// ==========================================

// 1. DOM Elements

const cells = document.querySelectorAll(".cell");
const gameBoardElement = document.getElementById("gameBoard");

const statusText = document.getElementById("statusText");

const scoreXElement = document.getElementById("scoreX");

const scoreOElement = document.getElementById("scoreO");

const restartBtn = document.getElementById("restartBtn");

const newGameBtn = document.getElementById("newGameBtn");

const themeToggle = document.getElementById("themeToggle");

const soundToggle = document.getElementById("soundToggle");

const playerXCard = document.querySelector(".player-x");

const playerOCard = document.querySelector(".player-o");

const playerXNameElement = document.getElementById("playerXName");

const playerONameElement = document.getElementById("playerOName");

const playerXInput = document.getElementById("playerXInput");

const playerOInput = document.getElementById("playerOInput");


// Statistics Dashboard Elements

const totalGamesElement = document.getElementById("totalGames");

const totalWinsXElement = document.getElementById("totalWinsX");

const totalWinsOElement = document.getElementById("totalWinsO");

const totalDrawsElement = document.getElementById("totalDraws");

const winRateXElement = document.getElementById("winRateX");

const winRateOElement = document.getElementById("winRateO");

const gameHistoryList = document.getElementById("gameHistoryList");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// 2. Game Variables

let currentPlayer = "X";

let gameBoard = ["", "", "", "", "", "", "", "", ""];

let gameActive = true;

let scoreX = Number(localStorage.getItem("scoreX")) || 0;

let scoreO = Number(localStorage.getItem("scoreO")) || 0;


let playerXName = localStorage.getItem("playerXName") || "Player X";

let playerOName = localStorage.getItem("playerOName") || "Player O";


// Sound Settings

let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

let audioContext = null;


// Game Statistics Data

let gameStats = JSON.parse(
    localStorage.getItem("gameStats")
) || {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0
};

// Game History Data

let gameHistory = JSON.parse(
    localStorage.getItem("gameHistory")
) || [];

// 3. Winning Combinations

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// 4. Update Scoreboard

function updateScoreboard() {

    scoreXElement.textContent = scoreX;

    scoreOElement.textContent = scoreO;

    localStorage.setItem("scoreX", scoreX);

    localStorage.setItem("scoreO", scoreO);

}


// 5. Update Active Player

function updateActivePlayer() {

    playerXCard.classList.toggle(
        "active",
        currentPlayer === "X"
    );

    playerOCard.classList.toggle(
        "active",
        currentPlayer === "O"
    );

}


// 6. Check Winner

function checkWinner() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            gameBoard[a] !== "" &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {

            return combination;

        }

    }

    return null;

}


// 7. Handle Cell Click

function handleCellClick(event) {

    const clickedCell = event.target;

    const clickedIndex = Number(clickedCell.dataset.index);


    // Check Game Status

    if (!gameActive) {
        return;
    }


    // Check Empty Cell

    if (gameBoard[clickedIndex] !== "") {
        return;
    }


    // Store Player Move

    gameBoard[clickedIndex] = currentPlayer;


    // Update Cell UI

    clickedCell.textContent = currentPlayer;

    clickedCell.classList.add(currentPlayer.toLowerCase());

    clickedCell.disabled = true;

    playMoveSound(currentPlayer);


    // Check Winner

    const winningCombination = checkWinner();


    if (winningCombination) {

        handleWin(winningCombination);

        return;

    }


    // Check Draw

    if (!gameBoard.includes("")) {

        handleDraw();

        return;

    }


    // Switch Player

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateGameStatus();

    updateActivePlayer();

}


// 8. Handle Winner

function handleWin(winningCombination) {

    gameActive = false;

    document.body.classList.remove("game-draw");
    document.body.classList.add("game-winner");

    playWinSound();
    startCelebration();

    winningCombination.forEach((index) => {

        cells[index].classList.add("winning-cell");

    });

    // Display Animated Winning Line

    showWinningLine(winningCombination);


    if (currentPlayer === "X") {

        scoreX++;

    } else {

        scoreO++;

    }


    updateScoreboard();

    recordGameResult(currentPlayer);

    statusText.textContent =
        `🎉 ${getCurrentPlayerName()} Wins!`;
}


// 9. Handle Draw
function handleDraw() {

    gameActive = false;

    document.body.classList.remove("game-winner");
    document.body.classList.add("game-draw");

    playDrawSound();

    recordGameResult("Draw");

    statusText.textContent = "🤝 Game Draw!";

}


// 10. Reset Current Game

function resetGame() {

    document.body.classList.remove("game-winner", "game-draw");

    clearCelebration();

    gameBoard = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;


    cells.forEach((cell) => {

        cell.textContent = "";

        cell.disabled = false;

        cell.classList.remove(
            "x",
            "o",
            "winning-cell"
        );

    });

    // Hide Previous Winning Line

    hideWinningLine();

    updateGameStatus();
    updateActivePlayer();

}


// 11. Start New Game

function startNewGame() {

    scoreX = 0;

    scoreO = 0;

    localStorage.removeItem("scoreX");

    localStorage.removeItem("scoreO");

    updateScoreboard();

    resetGame();

}


// 12. Event Listeners

cells.forEach((cell) => {

    cell.addEventListener("click", handleCellClick);

});


restartBtn.addEventListener("click", resetGame);


newGameBtn.addEventListener("click", startNewGame);


// 13. Initialize Game

updateScoreboard();

updateActivePlayer();


// ==========================================
// DARK / LIGHT THEME FUNCTIONALITY
// ==========================================

// 1. Apply Saved Theme

function applyTheme() {

    const savedTheme = localStorage.getItem("gameTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        themeToggle.textContent = "🌙 Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    } else {

        document.body.classList.remove("light-theme");

        themeToggle.textContent = "☀️ Light Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    }

}


// 2. Toggle Theme

function toggleTheme() {

    const isLightTheme = document.body.classList.toggle("light-theme");

    const selectedTheme = isLightTheme ? "light" : "dark";

    localStorage.setItem("gameTheme", selectedTheme);

    applyTheme();

}


// 3. Theme Button Event

themeToggle.addEventListener("click", toggleTheme);


// 4. Initialize Theme

applyTheme();



// ==========================================
// PLAYER NAME CUSTOMIZATION
// ==========================================

// 1. Update Player Names

function updatePlayerNames() {

    playerXNameElement.textContent = playerXName;

    playerONameElement.textContent = playerOName;

    playerXInput.value =
        playerXName === "Player X" ? "" : playerXName;

    playerOInput.value =
        playerOName === "Player O" ? "" : playerOName;

    updateGameStatus();

}


// 2. Get Current Player Name

function getCurrentPlayerName() {

    return currentPlayer === "X"
        ? playerXName
        : playerOName;

}


// 3. Update Game Status

function updateGameStatus() {

    if (!gameActive) {
        return;
    }

    statusText.textContent =
        `${getCurrentPlayerName()}'s Turn`;

}


// 4. Save Player X Name

playerXInput.addEventListener("change", () => {

    const enteredName = playerXInput.value.trim();

    playerXName = enteredName || "Player X";

    localStorage.setItem("playerXName", playerXName);

    updatePlayerNames();

});


// 5. Save Player O Name

playerOInput.addEventListener("change", () => {

    const enteredName = playerOInput.value.trim();

    playerOName = enteredName || "Player O";

    localStorage.setItem("playerOName", playerOName);

    updatePlayerNames();

});


// 6. Initialize Player Names

updatePlayerNames();


// ==========================================
// GAME STATISTICS FUNCTIONALITY
// ==========================================

// 1. Save Statistics

function saveGameStats() {

    localStorage.setItem(
        "gameStats",
        JSON.stringify(gameStats)
    );

    localStorage.setItem(
        "gameHistory",
        JSON.stringify(gameHistory)
    );

}


// 2. Update Statistics Dashboard

function updateStatisticsDashboard() {

    totalGamesElement.textContent = gameStats.totalGames;

    totalWinsXElement.textContent = gameStats.winsX;

    totalWinsOElement.textContent = gameStats.winsO;

    totalDrawsElement.textContent = gameStats.draws;

    const winRateX = gameStats.totalGames > 0
        ? ((gameStats.winsX / gameStats.totalGames) * 100).toFixed(1)
        : 0;

    const winRateO = gameStats.totalGames > 0
        ? ((gameStats.winsO / gameStats.totalGames) * 100).toFixed(1)
        : 0;

    winRateXElement.textContent = `${winRateX}%`;

    winRateOElement.textContent = `${winRateO}%`;

    renderGameHistory();

}


// 3. Render Game History

function renderGameHistory() {

    gameHistoryList.innerHTML = "";

    if (gameHistory.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.textContent = "No games played yet.";

        gameHistoryList.appendChild(emptyMessage);

        return;

    }

    gameHistory.slice(0, 10).forEach((game) => {

        const historyItem = document.createElement("li");

        historyItem.textContent =
            `${game.result} | ${game.date}`;

        gameHistoryList.appendChild(historyItem);

    });

}


// 4. Record Game Result

function recordGameResult(result) {

    gameStats.totalGames++;

    if (result === "X") {

        gameStats.winsX++;

    } else if (result === "O") {

        gameStats.winsO++;

    } else {

        gameStats.draws++;

    }

    const gameResult = result === "X"
        ? `${playerXName} Wins`
        : result === "O"
            ? `${playerOName} Wins`
            : "Game Draw";

    gameHistory.unshift({

        result: gameResult,

        date: new Date().toLocaleString()

    });

    gameHistory = gameHistory.slice(0, 10);

    saveGameStats();

    updateStatisticsDashboard();

}


// 5. Clear Game History

function clearGameHistory() {

    const confirmClear = confirm(
        "Are you sure you want to clear all game statistics and history?"
    );

    if (!confirmClear) {
        return;
    }

    gameStats = {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0
    };

    gameHistory = [];

    saveGameStats();

    updateStatisticsDashboard();

}


// 6. Clear History Button Event

clearHistoryBtn.addEventListener(
    "click",
    clearGameHistory
);


// 7. Initialize Statistics Dashboard

updateStatisticsDashboard();



// ==========================================
// PROFESSIONAL SOUND EFFECTS
// ==========================================

// 1. Create Audio Context

function getAudioContext() {

    if (!audioContext) {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        audioContext = new AudioContextClass();

    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;

}


// 2. Play Individual Tone

function playTone(frequency, duration, type = "sine", volume = 0.15) {

    if (!soundEnabled) return;

    const context = getAudioContext();

    if (!context) return;

    const startSound = () => {

        if (!soundEnabled) return;

        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        const now = context.currentTime;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(
            volume,
            now + 0.02
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);
    };

    if (context.state === "suspended") {
        context.resume().then(startSound).catch((error) => {
            console.warn("Audio could not start:", error);
        });
    } else {
        startSound();
    }
}


// 3. X and O Move Sounds

function playMoveSound(player) {

    if (player === "X") {

        playTone(550, 0.15, "sine", 0.12);

    } else {

        playTone(750, 0.15, "sine", 0.12);

    }

}


// 4. Winning Sound

function playWinSound() {

    if (!soundEnabled) {
        return;
    }

    playTone(523.25, 0.2, "sine", 0.15);

    setTimeout(() => {
        playTone(659.25, 0.2, "sine", 0.15);
    }, 180);

    setTimeout(() => {
        playTone(783.99, 0.3, "sine", 0.15);
    }, 360);

    setTimeout(() => {
        playTone(1046.50, 0.4, "sine", 0.15);
    }, 600);

}


// 5. Draw Sound

function playDrawSound() {

    if (!soundEnabled) {
        return;
    }

    playTone(400, 0.25, "triangle", 0.12);

    setTimeout(() => {
        playTone(300, 0.35, "triangle", 0.12);
    }, 250);

}


// 6. Update Sound Button

function updateSoundButton() {

    if (soundEnabled) {

        soundToggle.textContent = "🔊 Sound ON";

        soundToggle.setAttribute(
            "aria-label",
            "Turn sound off"
        );

    } else {

        soundToggle.textContent = "🔇 Sound OFF";

        soundToggle.setAttribute(
            "aria-label",
            "Turn sound on"
        );

    }

}


// 7. Toggle Sound

function toggleSound() {

    soundEnabled = !soundEnabled;

    localStorage.setItem(
        "soundEnabled",
        soundEnabled
    );

    updateSoundButton();

}


// 8. Sound Button Event

soundToggle.addEventListener("click", toggleSound);


// 9. Initialize Sound Settings

updateSoundButton();


// ==========================================
// ==========================================
// ==========================================
// WINNER FIREWORKS, ROCKETS AND BALLOONS
// ==========================================

let celebrationTimer = null;
let celebrationLayer = null;

function clearCelebration() {

    if (celebrationTimer) {
        clearTimeout(celebrationTimer);
        celebrationTimer = null;
    }

    if (celebrationLayer) {
        celebrationLayer.remove();
        celebrationLayer = null;
    }
}

function startCelebration() {

    clearCelebration();

    celebrationLayer = document.createElement("div");
    celebrationLayer.className = "celebration-layer";
    celebrationLayer.setAttribute("aria-hidden", "true");

    document.body.appendChild(celebrationLayer);

    // Colorful confetti
    const confettiColors = [
        "#ff4757", "#ffa502", "#2ed573",
        "#1e90ff", "#e056fd", "#f9ca24"
    ];

    for (let i = 0; i < 100; i++) {

        const piece = document.createElement("span");
        piece.className = "celebration-confetti";

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.background =
            confettiColors[Math.floor(Math.random() * confettiColors.length)];

        piece.style.animationDelay = Math.random() * 2 + "s";
        piece.style.animationDuration = 2.5 + Math.random() * 2 + "s";
        piece.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");

        celebrationLayer.appendChild(piece);
    }

    // Fireworks bursts
    for (let i = 0; i < 8; i++) {

        const firework = document.createElement("span");
        firework.className = "celebration-firework";

        firework.style.left = (10 + Math.random() * 80) + "vw";
        firework.style.top = (10 + Math.random() * 55) + "vh";
        firework.style.animationDelay = (Math.random() * 2) + "s";

        celebrationLayer.appendChild(firework);
    }

    // Flying rockets
    for (let i = 0; i < 5; i++) {

        const rocket = document.createElement("span");
        rocket.className = "celebration-rocket";
        rocket.textContent = "🚀";

        rocket.style.left = (10 + Math.random() * 80) + "vw";
        rocket.style.animationDelay = (Math.random() * 2) + "s";

        celebrationLayer.appendChild(rocket);
    }

    // Flying balloons
    const balloonColors = [
        "#ff4757", "#ffa502", "#2ed573",
        "#1e90ff", "#e056fd", "#ff6b81"
    ];

    for (let i = 0; i < 9; i++) {

        const balloon = document.createElement("span");
        balloon.className = "celebration-balloon";
        balloon.textContent = "🎈";

        balloon.style.left = (Math.random() * 95) + "vw";
        balloon.style.animationDelay = (Math.random() * 2) + "s";
        balloon.style.color = balloonColors[i % balloonColors.length];

        celebrationLayer.appendChild(balloon);
    }

    celebrationTimer = setTimeout(clearCelebration, 7000);
}


// PROFESSIONAL SVG WINNING LINE ANIMATION
// ==========================================

// Create SVG Overlay
const winningLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);

winningLine.classList.add("winning-line-svg");
winningLine.setAttribute("aria-hidden", "true");

gameBoardElement.appendChild(winningLine);


// Draw Winning Line Using Actual Cell Positions
function showWinningLine(combination) {

    const firstCell = cells[combination[0]];
    const lastCell = cells[combination[2]];

    if (!firstCell || !lastCell) {
        return;
    }

    // Remove Previous Line
    winningLine.replaceChildren();

    // Get Actual Positions
    const boardRect = gameBoardElement.getBoundingClientRect();

    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();

    // Calculate Cell Centers
    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;

    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

    // Create SVG Line
    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    // Calculate Actual Line Length
    const lineLength = Math.hypot(x2 - x1, y2 - y1);

    // Prepare Drawing Animation
    line.style.strokeDasharray = lineLength;
    line.style.strokeDashoffset = lineLength;

    winningLine.appendChild(line);

    // Start Animation
    requestAnimationFrame(() => {
        line.style.strokeDashoffset = "0";
    });
}


// Hide Winning Line
function hideWinningLine() {

    winningLine.replaceChildren();

}
