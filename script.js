const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const musicSelect = document.getElementById("musicSelect");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let missed = 0;
let tiles = [];
let gameRunning = false;
let speed = 2;
let audio = null;
let spawnInterval;
let tileInterval;

function createTile() {
  const tile = document.createElement("div");
  tile.classList.add("tile");

  const tileWidth = Math.max(60, Math.random() * 120);
  tile.style.width = `${tileWidth}px`;

  const x = Math.random() * (window.innerWidth - tileWidth);
  tile.style.left = `${x}px`;

  gameArea.appendChild(tile);
  tiles.push({ element: tile, y: -100 });

  const hit = () => {
    if (!gameRunning) return;
    score++;
    scoreDisplay.textContent = score;
    tile.remove();
    tiles = tiles.filter(t => t.element !== tile);
  };

  tile.addEventListener("click", hit);
  tile.addEventListener("touchstart", hit, { passive: true }); // для телефонов
}

function updateTiles() {
  tiles.forEach((tile, index) => {
    tile.y += speed;
    tile.element.style.top = `${tile.y}px`;

    if (tile.y > window.innerHeight) {
      missed++;
      missedDisplay.textContent = missed;
      tile.element.remove();
      tiles.splice(index, 1);

      if (missed >= 10) endGame();
    }
  });
}

function startGame() {
  const musicFile = musicSelect.value;
  if (!musicFile) {
    alert("🎶 Сначала выбери трек!");
    return;
  }

  score = 0;
  missed = 0;
  speed = 2;
  scoreDisplay.textContent = "0";
  missedDisplay.textContent = "0";
  gameOverScreen.classList.add("hidden");
  gameRunning = true;

  audio = new Audio(musicFile);
  audio.play();

  let interval = 500; // частота появления плиток
  spawnInterval = setInterval(() => {
    if (gameRunning) createTile();
  }, interval);

  tileInterval = setInterval(() => {
    if (gameRunning) {
      updateTiles();
      speed += 0.001;
    }
  }, 16);

  audio.onended = endGame;
}

function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  clearInterval(tileInterval);
  if (audio) audio.pause();

  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  startGame();
});

startBtn.addEventListener("click", startGame);
