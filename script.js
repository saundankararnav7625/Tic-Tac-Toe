// Tic-tac-toe against the computer.
// You are X and go first. The computer is O.
//
// The board is an array of 9 items. Index 0 is the top-left square,
// index 8 is the bottom-right:
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8

const PLAYER = "X";
const COMPUTER = "O";

// Every way to win: three rows, three columns, two diagonals
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#status");
const difficultySelect = document.querySelector("#difficulty");
const newGameButton = document.querySelector("#new-game");
const scoreElements = {
  player: document.querySelector("#score-player"),
  computer: document.querySelector("#score-computer"),
  draws: document.querySelector("#score-draws"),
};

let board;
let gameOver;
let computerThinking;
let computerTimer; // lets "New game" cancel a move that hasn't happened yet
const scores = { player: 0, computer: 0, draws: 0 };

// ---------- Game rules ----------

// Returns { player, line } if someone has three in a row, otherwise null.
function getWinner(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

function emptySquares(squares) {
  return squares.map((value, index) => (value === "" ? index : null)).filter((index) => index !== null);
}

// ---------- Computer opponent ----------

// Easy: pick any empty square at random.
function randomMove(squares) {
  const options = emptySquares(squares);
  return options[Math.floor(Math.random() * options.length)];
}

// Hard: minimax. The computer plays out every possible game from here
// and scores each ending: a computer win is good, a loss is bad, a draw is 0.
// It assumes you always play your best move, so it never loses.
function minimax(squares, computerTurn, depth) {
  const result = getWinner(squares);
  if (result) return result.player === COMPUTER ? 10 - depth : depth - 10; // prefer faster wins
  if (emptySquares(squares).length === 0) return 0;

  let best = computerTurn ? -Infinity : Infinity;
  for (const index of emptySquares(squares)) {
    squares[index] = computerTurn ? COMPUTER : PLAYER; // try the move
    const score = minimax(squares, !computerTurn, depth + 1);
    squares[index] = ""; // undo it
    best = computerTurn ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

function bestMove(squares) {
  let bestScore = -Infinity;
  let bestOptions = [];

  for (const index of emptySquares(squares)) {
    squares[index] = COMPUTER;
    const score = minimax(squares, false, 1);
    squares[index] = "";

    if (score > bestScore) {
      bestScore = score;
      bestOptions = [index];
    } else if (score === bestScore) {
      bestOptions.push(index);
    }
  }
  // If several moves are equally good, pick one at random so games vary.
  return bestOptions[Math.floor(Math.random() * bestOptions.length)];
}

function chooseComputerMove() {
  return difficultySelect.value === "easy" ? randomMove(board) : bestMove(board);
}

// ---------- Drawing the page ----------

function createBoard() {
  boardElement.innerHTML = "";
  for (let index = 0; index < 9; index++) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = index;
    boardElement.append(cell);
  }
}

function render(winningLine = []) {
  boardElement.querySelectorAll(".cell").forEach((cell, index) => {
    const value = board[index];
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;

    cell.textContent = value;
    cell.classList.toggle("x", value === PLAYER);
    cell.classList.toggle("o", value === COMPUTER);
    cell.classList.toggle("win", winningLine.includes(index));
    cell.setAttribute("aria-disabled", String(value !== "" || gameOver));
    cell.setAttribute("aria-label", `Row ${row}, column ${column}, ${value || "empty"}`);
  });

  for (const key of Object.keys(scores)) {
    scoreElements[key].textContent = scores[key];
  }
}

function setStatus(text) {
  statusElement.textContent = text;
}

// ---------- Game flow ----------

function startGame() {
  clearTimeout(computerTimer);
  board = Array(9).fill("");
  gameOver = false;
  computerThinking = false;
  render();
  setStatus("Your turn.");
}

// Checks whether the game has ended. Returns true if it has.
function checkEnd() {
  const result = getWinner(board);

  if (result) {
    gameOver = true;
    if (result.player === PLAYER) {
      scores.player++;
      setStatus("You win!");
    } else {
      scores.computer++;
      setStatus("The computer wins.");
    }
    render(result.line);
    return true;
  }

  if (emptySquares(board).length === 0) {
    gameOver = true;
    scores.draws++;
    setStatus("It's a draw.");
    render();
    return true;
  }

  return false;
}

function computerTurn() {
  board[chooseComputerMove()] = COMPUTER;
  computerThinking = false;
  if (!checkEnd()) {
    render();
    setStatus("Your turn.");
  }
}

boardElement.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell || gameOver || computerThinking) return;

  const index = Number(cell.dataset.index);
  if (board[index] !== "") return; // square already taken

  board[index] = PLAYER;
  if (checkEnd()) return;

  render();
  computerThinking = true;
  setStatus("Computer is thinking...");
  computerTimer = setTimeout(computerTurn, 400); // short pause so the move feels natural
});

newGameButton.addEventListener("click", startGame);
difficultySelect.addEventListener("change", startGame);

createBoard();
startGame();
