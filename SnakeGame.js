// ====== DOM references ======
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const overlay = document.getElementById("overlay");
const statusMessageEl = document.getElementById("status-message");
const startButton = document.getElementById("start-button");
const controlButtons = document.querySelectorAll(".control-btn");

// ====== Game constants ======
const GRID_SIZE = 21; // matches canvas width/height attributes
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_SPEED = 150; // milliseconds per move
const SPEED_INCREASE_EVERY = 5; // foods eaten
const SPEED_MULTIPLIER = 0.95;

// Directions as vectors
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// ====== Game state ======
let snake = [];
let direction = DIRECTIONS.right;
let nextDirection = DIRECTIONS.right;
let food = { x: 10, y: 10 };

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
let gameSpeed = INITIAL_SPEED;
let gameIntervalId = null;
let gameRunning = false;
let gameOver = false;

// Initialize high score display
highScoreEl.textContent = highScore.toString();

// ====== Utility functions ======
function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOpposite(dir1, dir2) {
  return dir1.x === -dir2.x && dir1.y === -dir2.y;
}

// ====== Game setup ======
function resetGame() {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  snake = [];
  // Head at startX, body trailing to the left
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: startX - i, y: startY });
  }

  direction = DIRECTIONS.right;
  nextDirection = DIRECTIONS.right;

  score = 0;
  scoreEl.textContent = score.toString();

  gameSpeed = INITIAL_SPEED;
  gameOver = false;
  gameRunning = false;
  clearInterval(gameIntervalId);
  gameIntervalId = null;

  placeFood();
  draw();

  statusMessageEl.textContent = "Press Start or Space to Play";
  startButton.textContent = "Start Game";
  overlay.classList.remove("hidden");
}

function placeFood() {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const overlapping = snake.some((segment) => segment.x === x && segment.y === y);
    if (!overlapping) {
      food = { x, y };
      return;
    }
  }
}

// ====== Game loop ======
function startGameLoop() {
  if (gameIntervalId) clearInterval(gameIntervalId);
  gameIntervalId = setInterval(tick, gameSpeed);
}

function tick() {
  if (!gameRunning) return;

  // Apply buffered direction
  direction = nextDirection;

  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  // Wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= GRID_SIZE ||
    newHead.y < 0 ||
    newHead.y >= GRID_SIZE
  ) {
    endGame("You hit the wall!");
    return;
  }

  // Self collision
  if (snake.some((segment) => positionsEqual(segment, newHead))) {
    endGame("You ran into yourself!");
    return;
  }

  // Move snake
  snake.unshift(newHead);

  // Check if food eaten
  if (positionsEqual(newHead, food)) {
    score++;
    scoreEl.textContent = score.toString();

    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore.toString();
      localStorage.setItem("snakeHighScore", String(highScore));
    }

    placeFood();

    // Increase speed every few foods
    if (score % SPEED_INCREASE_EVERY === 0) {
      gameSpeed = Math.max(50, gameSpeed * SPEED_MULTIPLIER);
      startGameLoop(); // restart interval with new speed
    }
  } else {
    // Remove tail if no food eaten
    snake.pop();
  }

  draw();
}

function endGame(reason) {
  gameRunning = false;
  gameOver = true;
  clearInterval(gameIntervalId);
  gameIntervalId = null;

  const message = `Game Over: ${reason}  •  Score: ${score}`;
  statusMessageEl.textContent = message;
  startButton.textContent = "Play Again";
  overlay.classList.remove("hidden");
}

// ====== Drawing ======
function draw() {
  // Clear board
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);

  // Optional light grid
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 0.05;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, GRID_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(GRID_SIZE, i);
    ctx.stroke();
  }

  // Draw food
  ctx.fillStyle = "#f97316";
  const foodRadius = 0.4;
  ctx.beginPath();
  ctx.arc(food.x + 0.5, food.y + 0.5, foodRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw snake
  snake.forEach((segment, index) => {
    const margin = 0.12;
    const x = segment.x + margin;
    const y = segment.y + margin;
    const size = 1 - margin * 2;

    if (index === 0) {
      ctx.fillStyle = "#22c55e"; // head
    } else {
      ctx.fillStyle = "#16a34a"; // body
    }
    ctx.fillRect(x, y, size, size);
  });
}

// ====== Controls ======
function setNextDirection(name) {
  const newDir = DIRECTIONS[name];
  if (!newDir) return;

  // Prevent reversing directly into yourself
  if (isOpposite(newDir, direction)) return;

  nextDirection = newDir;
}

function togglePauseOrStart() {
  if (gameOver) {
    resetGame();
    gameRunning = true;
    overlay.classList.add("hidden");
    startGameLoop();
    return;
  }

  if (!gameRunning) {
    // From initial state or paused
    gameRunning = true;
    overlay.classList.add("hidden");
    startGameLoop();
  } else {
    // Pause
    gameRunning = false;
    clearInterval(gameIntervalId);
    gameIntervalId = null;
    statusMessageEl.textContent = "Paused - Press Space or Start to Resume";
    startButton.textContent = "Resume";
    overlay.classList.remove("hidden");
  }
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
  const code = event.code;

  // Space to start / pause / resume
  if (code === "Space") {
    event.preventDefault();
    togglePauseOrStart();
    return;
  }

  // Direction keys
  const keyToDirection = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
  };

  const dirName = keyToDirection[code];
  if (dirName) {
    event.preventDefault();
    setNextDirection(dirName);
  }
});

// Touch / on-screen controls
controlButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-direction");
    setNextDirection(dir);
  });
});

// Start button
startButton.addEventListener("click", () => {
  togglePauseOrStart();
});

// Optional: tap on canvas to start / resume
canvas.addEventListener("click", () => {
  if (!gameRunning) {
    togglePauseOrStart();
  }
});

// ====== Initialize ======
resetGame();