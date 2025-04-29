# Breakout Game

A classic Breakout game implementation using JavaScript, HTML, and CSS.

## How to Run the Game

1. Clone this repository to your local machine.
2. Open the `html/breakout.html` file in a modern web browser (Chrome, Firefox, Safari, Edge, etc.).
3. No server or additional dependencies are required - the game runs directly in the browser.

## Controls

- **Left Arrow**: Move the paddle to the left.
- **Right Arrow**: Move the paddle to the right.
- **Space**: Launch the ball / Start the game.
- **R**: Restart the game after game over or winning.

## Rules and Objectives

### Objective
The goal of Breakout is to eliminate all blocks from the playing field by using the ball to break them while preventing the ball from falling below the paddle.

### Game Elements
- **Paddle**: Controlled by the player, used to bounce the ball upward.
- **Ball**: Bounces around the screen, breaking blocks on contact.
- **Blocks**: Arranged in rows at the top of the screen, disappear when hit by the ball.

### Gameplay
1. The player starts with 3 lives.
2. The game begins when the player presses the Space key, launching the ball from the paddle.
3. If the ball falls below the bottom of the screen (misses the paddle), the player loses a life.
4. When all lives are lost, the game is over.
5. When all blocks are destroyed, the player wins.
6. The score increases with each block destroyed.

## Project Structure

```
breakout-game/
├── assets/           # Game assets (images, sounds)
│   ├── sfx/          # Sound effects
│   └── sprites/      # Images and sprite sheets
├── css/              # Stylesheets
│   └── styles.css    # Main game styles
├── html/             # HTML files
│   └── breakout.html # Main game HTML file
├── js/               # JavaScript files
│   ├── breakout.js   # Main game logic
│   └── ...           # Utility classes and components
├── .gitignore        # Git ignore file
└── README.md         # This documentation
```

## Development

This project follows a structured development approach using Git branches for different features:

1. `setup/project-structure`: Initial project setup and structure
2. `feature/canvas-and-initial-entities`: Rendering the canvas and creating basic entities
3. `feature/ball-movement-and-bouncing`: Implementing ball physics and collisions
4. `feature/paddle-control`: Making the paddle respond to player input
5. `feature/block-creation-and-destruction`: Adding blocks and their removal on collision
6. `feature/lives-and-game-messages`: Adding game state management and UI elements
7. `feature/creative-enhancement`: Special improvements and creative additions
8. `docs/final-documentation`: Final documentation and code style improvements 