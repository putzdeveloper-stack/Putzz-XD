let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameOver = false;

const winSound = new Audio("win.mp3");

document.getElementById("startGame").addEventListener("click", () => {
  boardSize = parseInt(document.getElementById("boardSize").value);
  startGame();
});

function startGame() {
  board = [];
  currentPlayer = "X";
  gameOver = false;
  document.getElementById("status").textContent = "Giliran: " + currentPlayer;

  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;

  for (let i = 0; i < boardSize * boardSize; i++) {
    board.push("");
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    boardEl.appendChild(cell);
  }
}

function handleMove(e) {
  if (gameOver) return;

  const index = e.target.dataset.index;
  if (board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    gameOver = true;
    document.getElementById("status").textContent = currentPlayer + " MENANG!";
    winSound.play();
    return;
  }

  if (board.every(c => c !== "")) {
    gameOver = true;
    document.getElementById("status").textContent = "SERI!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("status").textContent = "Giliran: " + currentPlayer;
}

function checkWin(player) {
  // Check rows
  for (let r = 0; r < boardSize; r++) {
    let row = true;
    for (let c = 0; c < boardSize; c++) {
      if (board[r * boardSize + c] !== player) row = false;
    }
    if (row) return true;
  }

  // Check columns
  for (let c = 0; c < boardSize; c++) {
    let col = true;
    for (let r = 0; r < boardSize; r++) {
      if (board[r * boardSize + c] !== player) col = false;
    }
    if (col) return true;
  }

  // Check diagonal
  let d1 = true;
  for (let i = 0; i < boardSize; i++) {
    if (board[i * boardSize + i] !== player) d1 = false;
  }
  if (d1) return true;

  // Check diagonal reverse
  let d2 = true;
  for (let i = 0; i < boardSize; i++) {
    if (board[i * boardSize + (boardSize - 1 - i)] !== player) d2 = false;
  }
  if (d2) return true;

  return false;
}