let board = [];
let currentPlayer = "X";
let size = 3;
let gameOver = false;

const boardEl = document.getElementById("board");
const infoText = document.getElementById("infoText");
const winnerOverlay = document.getElementById("winnerOverlay");
const winSound = document.getElementById("winSound");

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
    size = parseInt(document.getElementById("boardSize").value);
    board = Array(size * size).fill("");
    currentPlayer = "X";
    gameOver = false;

    winnerOverlay.style.display = "none";
    infoText.innerText = "Giliran: " + currentPlayer;

    boardEl.style.gridTemplateColumns = `repeat(${size}, 80px)`;
    boardEl.innerHTML = "";

    board.forEach((_, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.addEventListener("click", () => clickCell(i));
        boardEl.appendChild(cell);
    });
}

function clickCell(i) {
    if (gameOver || board[i] !== "") return;

    board[i] = currentPlayer;
    document.querySelector(`.cell[data-index="${i}"]`).innerText = currentPlayer;

    if (checkWin()) {
        showWinner(currentPlayer);
        return;
    }

    if (board.every(c => c !== "")) {
        showWinner("Seri");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    infoText.innerText = "Giliran: " + currentPlayer;
}

function showWinner(winner) {
    gameOver = true;
    winSound.play();

    winnerOverlay.style.display = "block";
    winnerOverlay.innerText = winner === "Seri" ? "Permainan Seri!" : `${winner} Menang!`;

    infoText.innerText = "";
}

function checkWin() {
    // Rows
    for (let r = 0; r < size; r++) {
        let row = board.slice(r * size, r * size + size);
        if (row.every(cell => cell === currentPlayer)) return true;
    }

    // Columns
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) col.push(board[r * size + c]);
        if (col.every(cell => cell === currentPlayer)) return true;
    }

    // Diagonal
    let d1 = [], d2 = [];
    for (let i = 0; i < size; i++) {
        d1.push(board[i * size + i]);
        d2.push(board[i * size + (size - 1 - i)]);
    }
    if (d1.every(c => c === currentPlayer)) return true;
    if (d2.every(c => c === currentPlayer)) return true;

    return false;
}