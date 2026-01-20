# Nokia Snake Game 🐍

🎮 **Live Demo**: https://jxvz01.github.io/nokia-snake-game/

Classic Nokia 3310 Snake game recreation built as a single self-contained HTML file with a retro green/black theme.

---

## 🚀 Features

- **5 Gameplay Levels**
  - Classic (walls kill)
  - Teleport (wrap around edges)
  - Reverse (inverted arrow keys)
  - Fast (extra speed boost)
  - Walls (internal obstacles)

- **3 Difficulty Speeds**
  - Easy (slow)
  - Medium (normal)
  - Impossible (very fast)

- **Controls**
  - Arrow keys (↑ ↓ ← →) to move
  - Spacebar to restart after game over

- **Scoring System**
  - +10 points per food eaten
  - Game ends on collision with walls, body, or obstacles

- **Responsive Design**
  - Works on desktop and mobile
  - Centered layout with touch-friendly buttons

---

## 🛠 Tech Stack

- **HTML5 Canvas** – game rendering  
- **Vanilla JavaScript** – game logic  
- **CSS Flexbox** – layout & styling  
- No external libraries used

---

## 📂 Code Structure (Single File)

- **HTML** – Menu screen, game screen, canvas, controls
- **CSS** – Nokia-style green theme, monospace font, borders
- **JavaScript**
  - Game loop
  - Collision detection
  - Level & speed logic
  - Keyboard event handling

---

## ⚙️ Core JavaScript Functions

- `startGame()` – Resets game state and starts the loop  
- `drawGame()` – Updates snake, checks collisions, renders canvas  
- `loop()` – Runs the game using `setTimeout(drawGame, speed)`  
- `gameOver()` – Stops the loop and displays the final score  

---

## ▶️ How to Run Locally

1. Clone or download the repository  
2. Open `index.html` in any modern web browser  
3. Use arrow keys to play  

---

## 🎯 Purpose

This project was built to practice:
- Game loops and timing
- Canvas rendering
- Real-time input handling
- Clean UI design using plain JavaScript

---

## 📌 Status

✅ Completed
