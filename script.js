let board = [];
let size = 3;
let currentPlayer = "X";
let gameActive = true;

const boardEl = document.getElementById("board");
const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const popupWin = document.getElementById("popupWin");
const popupText = document.getElementById("popupText");
const winSound = document.getElementById("winSound");

// START GAME
document.getElementById("startBtn").onclick = () => {
    size = parseInt(document.getElementById("boardSize").value);
    startGame();
};

// MAIN GAME FUNCTION
function startGame() {
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("currentPlayer").innerText = currentPlayer;

    menu.classList.add("hidden");
    gameArea.classList.remove("hidden");

    board = Array(size * size).fill("");

    boardEl.style.gridTemplateColumns = `repeat(${size}, 70px)`;
    boardEl.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.onclick = () => makeMove(i);
        boardEl.appendChild(cell);
    }
}

// PLAYER MOVE
function makeMove(i) {
    if (!gameActive || board[i] !== "") return;

    board[i] = currentPlayer;
    document.querySelectorAll(".cell")[i].innerText = currentPlayer;

    if (checkWin()) return endGame(`${currentPlayer} Menang!`);
    if (board.every(c => c !== "")) return endGame("Seri!");

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("currentPlayer").innerText = currentPlayer;
}

// CEK MENANG (berlaku 3x3, 4x4, 5x5)
function checkWin() {
    // Cek baris
    for (let r = 0; r < size; r++) {
        let row = true;
        for (let c = 0; c < size; c++) {
            if (board[r * size + c] !== currentPlayer) row = false;
        }
        if (row) return true;
    }

    // Cek kolom
    for (let c = 0; c < size; c++) {
        let col = true;
        for (let r = 0; r < size; r++) {
            if (board[r * size + c] !== currentPlayer) col = false;
        }
        if (col) return true;
    }

    // Cek diagonal utama
    let diag1 = true;
    for (let i = 0; i < size; i++) {
        if (board[i * size + i] !== currentPlayer) diag1 = false;
    }
    if (diag1) return true;

    // Cek diagonal kedua
    let diag2 = true;
    for (let i = 0; i < size; i++) {
        if (board[i * size + (size - 1 - i)] !== currentPlayer) diag2 = false;
    }
    if (diag2) return true;

    return false;
}

// END GAME POPUP
function endGame(msg) {
    gameActive = false;

    popupText.innerText = msg;
    popupWin.classList.remove("hidden");

    winSound.play();

    document.getElementById("playAgain").onclick = () => {
        popupWin.classList.add("hidden");
        startGame();
    };
}