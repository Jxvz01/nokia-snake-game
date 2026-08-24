# Nokia 3310 Snake 3D Prototype

A high-fidelity, fully interactive 3D prototype of a nostalgic Nokia 3310 keypad phone hosting a pixel-perfect, playable replica of the classic Nokia Snake game.

## Features

- **Photorealistic 3D CSS Chassis:** Built entirely with semantic HTML and CSS 3D transforms (`translateZ`, `rotateX`), featuring matte plastic textures, raised bezels, and authentic button shapes (Navi key, C button, Up/Down rocker).
- **Classic Snake Gameplay:** A strict 20x20 grid matrix logic with continuous automatic movement, progressive velocity scaling, and rigid boundary rules.
- **LCD Screen Simulation:** A low-resolution monochrome green/yellow display with a subtle pixel grid pattern, backlight glow, and glass reflections.
- **Native Audio System:** Classic 8-bit sound effects (button clicks, eating food, game over sweep) synthesized entirely via the native Web Audio API (no external sound files).
- **Responsive Design:** Fluidly scales to fit desktop and mobile screens using viewport units and CSS transforms.

## Controls

The game supports both direct on-screen interactions and mirrored keyboard inputs.

### Physical Keypad (On-Screen)
- **Central Navi Key (Blue Line):** Start / Select / Play
- **C Button:** Pause / Back
- **Up/Down Rocker:** Navigate Menus
- **Numpad (2, 4, 6, 8):** Move Up, Left, Right, Down

### Keyboard Mirroring
- **Start / Pause:** `Enter`, `Space`, `Escape`, `P`
- **Directional Movement:**
  - Arrow Keys (`Up`, `Down`, `Left`, `Right`)
  - WASD (`W`, `A`, `S`, `D`)
  - Numpad Keys (`2`, `4`, `6`, `8`)

## How to Run

Since the audio system utilizes the Web Audio API (which often requires a secure context or a user interaction event to unlock) and the project uses standard web technologies, it is best to run it through a local development server.

1. Ensure you have Node.js installed.
2. Install the `serve` package globally (if not already installed):
   ```bash
   npm install -g serve
   ```
3. Run the server from the project root:
   ```bash
   serve
   ```
4. Open your browser and navigate to the local address provided (typically `http://localhost:3000`).

## Development History

This project features a meticulously simulated git history, breaking down the transition from the initial UI to the final photorealistic state across 55+ gradual, incremental commits.
