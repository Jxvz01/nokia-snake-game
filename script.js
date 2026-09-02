// ----------------------------------------------------
// Audio System (Web Audio API)
// ----------------------------------------------------

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Keypad Click: High-pitched square-wave beep (800Hz, 30ms duration)
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);

    // Envelope to avoid popping
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.03);
}

// Food Consumed: Rapid dual-tone rising arpeggio (600Hz to 1200Hz, 80ms duration)
function playEatSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';

    // Arpeggio: 600Hz -> 1200Hz
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
}

// Game Over State: Descending sawtooth frequency sweep (400Hz gliding down to 100Hz, 400ms duration)
function playGameOverSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';

    // Sweep: 400Hz -> 100Hz
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
}

// Expose to window for UI usage
window.audioSystem = {
    playClickSound,
    playEatSound,
    playGameOverSound
};

// ----------------------------------------------------
// Game Engine (Snake)
// ----------------------------------------------------

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game Grid Settings (20x20 matrix)
const GRID_SIZE = 20;
let CELL_SIZE;
let snake = [];
let food = null;
let direction = { x: 1, y: 0 }; // Moving right initially
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameState = 'START'; // START, PLAYING, PAUSED, GAMEOVER

// Speed / Difficulty Progression
const STARTING_TICK = 200;
const TICK_DECREMENT = 5;
const MIN_TICK = 60;
let currentTick = STARTING_TICK;
let lastFrameTime = 0;

// UI Elements
const uiScoreLayer = document.getElementById('ui-score-layer');
const scoreText = document.getElementById('score-text');
const uiGameOverLayer = document.getElementById('ui-game-over-layer');
const uiStartLayer = document.getElementById('ui-start-layer');
const uiPauseLayer = document.getElementById('ui-pause-layer');

// Resize canvas and cells
function resizeCanvas() {
    const parent = canvas.parentElement;
    // We want the canvas to be square and fit within the container
    const size = Math.min(parent.clientWidth, parent.clientHeight) - 8; // -8 for padding
    canvas.width = size;
    canvas.height = size;
    CELL_SIZE = size / GRID_SIZE;
    draw(); // Redraw if resized
}

window.addEventListener('resize', resizeCanvas);

// Initialize Game
function initGame() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    currentTick = STARTING_TICK;
    updateScoreDisplay();
    spawnFood();
}

function updateScoreDisplay() {
    scoreText.innerText = `Score: ${score}`;
}

// Spawn Food
function spawnFood() {
    let newFood;
    let validSpawn = false;
    while (!validSpawn) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Ensure food doesn't spawn on snake
        validSpawn = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    food = newFood;
}

// Draw Frame
function draw() {
    // Clear canvas completely to keep transparent background showing the green/yellow
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'START' || snake.length === 0) return;

    // Set pixel style
    ctx.fillStyle = '#1a2305'; // Dark color matching text for LCD contrast

    // Draw Food
    if (food) {
        // Draw food as a slight cross or block
        const padding = 1;
        ctx.fillRect(
            food.x * CELL_SIZE + padding,
            food.y * CELL_SIZE + padding,
            CELL_SIZE - padding * 2,
            CELL_SIZE - padding * 2
        );
    }

    // Draw Snake
    snake.forEach(segment => {
        // Leave a tiny gap between segments for blocky look
        const padding = 0.5;
        ctx.fillRect(
            segment.x * CELL_SIZE + padding,
            segment.y * CELL_SIZE + padding,
            CELL_SIZE - padding * 2,
            CELL_SIZE - padding * 2
        );
    });
}

// Game Loop
function gameLoop(timestamp) {
    if (gameState === 'PLAYING') {
        const deltaTime = timestamp - lastFrameTime;

        if (deltaTime >= currentTick) {
            update();
            draw();
            lastFrameTime = timestamp;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Update Logic
function update() {
    direction = nextDirection;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check Wall Collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return;
    }

    // Check Self Collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return;
    }

    snake.unshift(head); // Add new head

    // Check Food Collision
    if (head.x === food.x && head.y === food.y) {
        // Ate food
        score++;
        updateScoreDisplay();
        window.audioSystem.playEatSound();
        spawnFood();

        // Increase speed
        currentTick = Math.max(MIN_TICK, currentTick - TICK_DECREMENT);

        // Visual flash of LCD
        flashScreen();
    } else {
        // Didn't eat, remove tail
        snake.pop();
    }
}

// Visual LCD flash
function flashScreen() {
    const lcd = document.getElementById('lcd-screen');
    lcd.style.backgroundColor = '#a4b830'; // Lighter color
    setTimeout(() => {
        lcd.style.backgroundColor = '#879b29'; // Back to normal
    }, 50);
}

// Handle Game Over
function handleGameOver() {
    gameState = 'GAMEOVER';
    window.audioSystem.playGameOverSound();

    uiGameOverLayer.classList.remove('overlay-hidden');
}

// Handle Start / Pause
function toggleStartPause() {
    if (gameState === 'START') {
        uiStartLayer.classList.add('overlay-hidden');
        uiScoreLayer.classList.remove('overlay-hidden');
        initGame();
        gameState = 'PLAYING';
        lastFrameTime = performance.now();
    } else if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        uiPauseLayer.classList.remove('overlay-hidden');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        uiPauseLayer.classList.add('overlay-hidden');
        lastFrameTime = performance.now(); // Reset timer to prevent jump
    } else if (gameState === 'GAMEOVER') {
        uiGameOverLayer.classList.add('overlay-hidden');
        initGame();
        gameState = 'PLAYING';
        lastFrameTime = performance.now();
    }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    uiScoreLayer.classList.add('overlay-hidden'); // Hide score initially
    uiStartLayer.classList.remove('overlay-hidden'); // Show start screen
    requestAnimationFrame(gameLoop);
});

// Expose game control to window
window.gameSystem = {
    setNextDirection: (dir) => {
        // Prevent 180 degree turns
        if (dir.x !== 0 && direction.x === 0) {
            nextDirection = dir;
        } else if (dir.y !== 0 && direction.y === 0) {
            nextDirection = dir;
        }
    },
    toggleStartPause,
    getState: () => gameState
};

// ----------------------------------------------------
// Input Binding & Interactions
// ----------------------------------------------------

// Map physical actions to game directions
const ACTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Map virtual keys to Actions or System Commands
// "nav-up", "nav-down", "2", "4", "6", "8", etc.
function handleKeyAction(keyId) {
    // Visual and audio feedback
    const btn = document.querySelector(`[data-key="${keyId}"]`);
    if (btn) {
        btn.classList.add('active-press');
        setTimeout(() => btn.classList.remove('active-press'), 100);
    }

    // Always play click sound
    window.audioSystem.playClickSound();

    const state = window.gameSystem.getState();

    // If game is in START or GAMEOVER state, ANY key starts/restarts
    if (state === 'START' || state === 'GAMEOVER') {
        window.gameSystem.toggleStartPause();
        return;
    }

    // Soft keys act as pause/play
    if (keyId === 'soft-left' || keyId === 'soft-right') {
        window.gameSystem.toggleStartPause();
        return;
    }

    // Directional inputs
    if (state === 'PLAYING') {
        switch (keyId) {
            case 'nav-up':
            case '2':
                window.gameSystem.setNextDirection(ACTIONS.UP);
                break;
            case 'nav-down':
            case '8':
                window.gameSystem.setNextDirection(ACTIONS.DOWN);
                break;
            case '4':
                window.gameSystem.setNextDirection(ACTIONS.LEFT);
                break;
            case '6':
                window.gameSystem.setNextDirection(ACTIONS.RIGHT);
                break;
        }
    }
}

// Bind physical UI buttons
document.querySelectorAll('.key').forEach(button => {
    // Use mousedown/touchstart for immediate response, not click
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleKeyAction(button.getAttribute('data-key'));
    });

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleKeyAction(button.getAttribute('data-key'));
    }, { passive: false });
});

// Bind Keyboard Mirroring (WASD / Arrows)
const KEYBOARD_MAP = {
    'ArrowUp': 'nav-up',
    'w': '2',
    'W': '2',
    '2': '2',

    'ArrowDown': 'nav-down',
    's': '8',
    'S': '8',
    '8': '8',

    'ArrowLeft': '4',
    'a': '4',
    'A': '4',
    '4': '4',

    'ArrowRight': '6',
    'd': '6',
    'D': '6',
    '6': '6',

    'Enter': 'soft-left',
    ' ': 'soft-right', // Spacebar
    'Escape': 'soft-right',
    'p': 'soft-left',
    'P': 'soft-left'
};

document.addEventListener('keydown', (e) => {
    const keyId = KEYBOARD_MAP[e.key];
    if (keyId) {
        // Prevent default scrolling for arrows/space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Prevent repeating keys when held down
        if (!e.repeat) {
            handleKeyAction(keyId);
        }
    }
});
