// ========== LOADING LOGIC ==========
window.onload = () => {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("menu-screen").style.display = "flex";
    }, 2000); // 2 detik
};

// =============================
// GAME KAMU MULAI DARI SINI
// =============================
const menu = document.getElementById("menu-screen");
const game = document.querySelector(".container");
const board = document.getElementById("board");

let mode = null;
let difficulty = "easy";
let currentPlayer = "X";
let cells = ["","","","","","","","",""];
let gameOver = false;

let scoreX = 0, scoreO = 0, scoreT = 0;

document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.onclick = () => {
        if (btn.dataset.mode) {
            mode = btn.dataset.mode;
            if (mode === "1player") {
                document.getElementById("difficulty").style.display = "block";
            } else {
                document.getElementById("difficulty").style.display = "none";
            }
        }
        if (btn.id === "startBtn") {
            if (!mode) return alert("Pilih mode dulu!");
            menu.style.display = "none";
            game.style.display = "block";
            startGame();
        }
    };
});

document.querySelectorAll(".dif").forEach(btn => {
    btn.onclick = () => {
        difficulty = btn.dataset.dif;
        document.querySelectorAll(".dif").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
    };
});

function startGame() {
    board.innerHTML = "";
    cells = ["","","","","","","","",""];
    currentPlayer = "X";
    gameOver = false;
    document.getElementById("turnInfo").innerText = "Giliran: X";

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.onclick = () => handleMove(i);
        board.appendChild(cell);
    }
}

function handleMove(i) {
    if (cells[i] !== "" || gameOver) return;

    cells[i] = currentPlayer;
    updateBoard();

    if (checkWinner(currentPlayer)) {
        gameOver = true;
        endGame(currentPlayer + " Menang!");
        return;
    }

    if (!cells.includes("")) {
        scoreT++;
        document.getElementById("scoreT").innerText = scoreT;
        return gameOver = true;
    }

    if (mode === "1player") {
        currentPlayer = "O";
        setTimeout(aiMove, 300);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("turnInfo").innerText = "Giliran: " + currentPlayer;
    }
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.innerText = cells[i];
    });
}

function aiMove() {
    if (gameOver) return;

    let available = cells.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    let choice;

    if (difficulty === "easy") {
        choice = available[Math.floor(Math.random()*available.length)];
    } else if (difficulty === "medium") {
        choice = available.length > 6 ? 
            available[Math.floor(Math.random() * available.length)] : smartAI();
    } else {
        choice = smartAI();
    }

    cells[choice] = "O";
    updateBoard();

    if (checkWinner("O")) {
        gameOver = true;
        endGame("O Menang!");
        return;
    }

    if (!cells.includes("")) {
        scoreT++;
        document.getElementById("scoreT").innerText = scoreT;
        return gameOver = true;
    }

    currentPlayer = "X";
    document.getElementById("turnInfo").innerText = "Giliran: X";
}

function smartAI() {
    let wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let w of wins) {
        let [a,b,c] = w;
        if (cells[a]==="O" && cells[b]==="O" && cells[c]==="") return c;
        if (cells[a]==="O" && cells[c]==="O" && cells[b]==="") return b;
        if (cells[b]==="O" && cells[c]==="O" && cells[a]==="") return a;
    }

    for (let w of wins) {
        let [a,b,c] = w;
        if (cells[a]==="X" && cells[b]==="X" && cells[c]==="") return c;
        if (cells[a]==="X" && cells[c]==="X" && cells[b]==="") return b;
        if (cells[b]==="X" && cells[c]==="X" && cells[a]==="") return a;
    }

    let empty = cells.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

function checkWinner(p) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(w => w.every(i => cells[i] === p));
}

function endGame(msg) {
    if (msg.includes("X")) scoreX++;
    if (msg.includes("O")) scoreO++;

    document.getElementById("scoreX").innerText = scoreX;
    document.getElementById("scoreO").innerText = scoreO;

    setTimeout(() => {
        alert(msg);
        startGame();
    }, 300);
}

document.getElementById("btnReset").onclick = startGame;