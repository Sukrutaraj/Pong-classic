const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let p1Name = "Player 1";
let p2Name = "Player 2";

let paddleHeight = 100;
let paddleWidth = 15;

let p1Y = 200;
let p2Y = 200;

let ballX = 400;
let ballY = 300;
let ballSize = 20;
let ballSpeedX = 5;
let ballSpeedY = 4;

let p1Score = 0;
let p2Score = 0;

let gameRunning = false;
let currentColor = "white";

// ★★ ljud ★★
const pingSound = new Audio("pingpong.wav");
const missSound = new Audio("miss.wav");
const gameoverSound = new Audio("gameover.wav");

// ★★ svårighetsnivåer ★★
const difficultySettings = {
    easy: { speed: 4, paddle: 140 },
    intermediate: { speed: 6, paddle: 110 },
    hard: { speed: 8, paddle: 90 }
};

// ★★ färgteman ★★
const colorThemes = {
    white: "white",
    neonblue: "#33aaff",
    neongreen: "#00ff88",
    sunset: "#ff9d00"
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ★★ Start ★★
document.getElementById("startButton").addEventListener("click", () => {
    p1Name = document.getElementById("p1name").value || "Player 1";
    p2Name = document.getElementById("p2name").value || "Player 2";

    let difficulty = document.getElementById("difficulty").value;
    currentColor = document.getElementById("colorTheme").value;

    ballSpeedX = difficultySettings[difficulty].speed;
    paddleHeight = difficultySettings[difficulty].paddle;

    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;

    gameLoop();
});

// ★★ Tangenter ★★
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayers() {
    if (keys["w"]) p1Y -= 6;
    if (keys["s"]) p1Y += 6;
    if (keys["ArrowUp"]) p2Y -= 6;
    if (keys["ArrowDown"]) p2Y += 6;

    p1Y = Math.max(0, Math.min(canvas.height - paddleHeight, p1Y));
    p2Y = Math.max(0, Math.min(canvas.height - paddleHeight, p2Y));
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    // träff p1
    if (ballX <= paddleWidth &&
        ballY + ballSize >= p1Y &&
        ballY <= p1Y + paddleHeight) {
        ballSpeedX *= -1;
        pingSound.play();
    }

    // träff p2
    if (ballX + ballSize >= canvas.width - paddleWidth &&
        ballY + ballSize >= p2Y &&
        ballY <= p2Y + paddleHeight) {
        ballSpeedX *= -1;
        pingSound.play();
    }

    // miss
    if (ballX < 0) {
        p2Score++;
        missSound.play();
        resetBall();
    }
    if (ballX > canvas.width) {
        p1Score++;
        missSound.play();
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorThemes[currentColor];

    // centerline
    ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);

    // paddlar
    ctx.fillRect(0, p1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, p2Y, paddleWidth, paddleHeight);

    // ★★ cirkelboll ★★
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // text
    ctx.font = "28px Arial";
    ctx.fillText(`${p1Name}: ${p1Score}`, 40, 40);
    ctx.fillText(`${p2Name}: ${p2Score}`, canvas.width - 200, 40);
}

function gameLoop() {
    if (!gameRunning) return;

    movePlayers();
    moveBall();
    draw();

    requestAnimationFrame(gameLoop);
}
