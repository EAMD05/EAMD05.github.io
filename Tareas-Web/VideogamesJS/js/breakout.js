/*
 * Implementation of the game of Breakout
 * 
 * This script handles the core game logic for the Breakout game, including:
 * - Rendering the game canvas
 * - Creating and managing game entities (paddle, ball, blocks)
 * - Handling game state and user input
 * - Collision detection and game physics
 * - Multiple levels with increasing difficulty
 *
 * Date: 2024
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Variable to store the times for the frames
let oldTime;

// Global settings
const paddleVelocity = 0.5;
const initialBallSpeed = 0.3;
const ballSpeedIncrease = 1.05; // Speed multiplier after breaking blocks

// Block settings
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 80;
const blockOffsetLeft = 55;

// Block colors per row
const blockColors = [
    "#FF5757", // Red
    "#FFD557", // Yellow
    "#57FF5A", // Green
    "#5793FF", // Blue
    "#D557FF"  // Purple
];

// Level definitions
const levels = [
    // Level 1 - Basic rectangle pattern
    {
        name: "Level 1",
        rows: 5,
        columns: 8,
        speed: 1.0,
        pattern: "rectangle"
    },
    // Level 2 - Pyramid pattern with faster ball
    {
        name: "Level 2",
        rows: 6,
        columns: 9,
        speed: 1.2,
        pattern: "pyramid"
    },
    // Level 3 - Checkerboard pattern with even faster ball
    {
        name: "Level 3",
        rows: 6,
        columns: 10,
        speed: 1.4,
        pattern: "checkerboard"
    }
];

// Sound effects
let hitSoundEffect;
let blockBreakSound;
let levelUpSound;

// Context of the Canvas
let ctx;

// The game object
let game;

// Classes for the Breakout game
class Ball extends GameObject {
    constructor(position, radius, color) {
        // Call the parent's constructor
        super(position, radius * 2, radius * 2, color, "ball");
        this.radius = radius;
        this.baseSpeed = initialBallSpeed;
        this.speedMultiplier = 1.0;
        this.reset();
    }

    update(deltaTime) {
        // Move the ball according to its velocity
        this.position = this.position.plus(this.velocity.times(deltaTime));
        
        // Boundary collision detection - sides of the canvas
        this.handleWallCollisions();
    }

    handleWallCollisions() {
        // Right wall collision
        if (this.position.x + this.radius * 2 > canvasWidth) {
            this.position.x = canvasWidth - this.radius * 2;
            this.velocity.x = -Math.abs(this.velocity.x); // Bounce left
            if (hitSoundEffect) hitSoundEffect.play();
        }
        
        // Left wall collision
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = Math.abs(this.velocity.x); // Bounce right
            if (hitSoundEffect) hitSoundEffect.play();
        }
        
        // Top wall collision
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = Math.abs(this.velocity.y); // Bounce down
            if (hitSoundEffect) hitSoundEffect.play();
        }
    }

    initVelocity() {
        // Launch the ball at a random angle upward
        let angle = Math.random() * Math.PI / 4 + Math.PI / 4; // Between 45 and 90 degrees
        if (Math.random() > 0.5) {
            angle = Math.PI - angle; // Mirror for left launch
        }
        
        // Apply level speed multiplier
        const effectiveSpeed = this.baseSpeed * this.speedMultiplier;
        
        this.velocity = new Vec(
            Math.cos(angle) * effectiveSpeed,
            -Math.sin(angle) * effectiveSpeed // Negative y for upward movement
        );
        this.inPlay = true;
    }

    reset() {
        this.position = new Vec(canvasWidth / 2 - this.radius, canvasHeight - 50);
        this.velocity = new Vec(0, 0);
        this.inPlay = false;
    }
    
    setSpeedMultiplier(multiplier) {
        this.speedMultiplier = multiplier;
    }

    // Override the draw method to draw a circle instead of a rectangle
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x + this.radius, this.position.y + this.radius, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    
    // Get center position of the ball
    getCenter() {
        return new Vec(
            this.position.x + this.radius,
            this.position.y + this.radius
        );
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vec(0, 0);
        this.speed = paddleVelocity;
        this.leftPressed = false;
        this.rightPressed = false;
    }

    update(deltaTime) {
        // Update horizontal movement based on key presses
        let moveX = 0;
        if (this.leftPressed) moveX -= this.speed * deltaTime;
        if (this.rightPressed) moveX += this.speed * deltaTime;
        
        // Update position
        this.position.x += moveX;
        
        // Keep paddle within canvas boundaries
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
    
    setLeftPressed(isPressed) {
        this.leftPressed = isPressed;
    }
    
    setRightPressed(isPressed) {
        this.rightPressed = isPressed;
    }
}

class Block extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "block");
        this.active = true;
    }

    // Override draw method to add a border
    draw(ctx) {
        if (this.active) {
            // Fill the block
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            
            // Draw a border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}

// Texto con sombra para mejor visibilidad
class GameText {
    constructor(x, y, fontSize, color, align = "left") {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.color = color;
        this.align = align;
        this.font = `${fontSize}px Arial`;
    }
    
    draw(ctx, text) {
        ctx.font = this.font;
        ctx.textAlign = this.align;
        
        // Efecto de sombra
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillText(text, this.x + 2, this.y + 2);
        
        // Texto principal
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

// Class that controls all the objects in the game
class Game {
    constructor(canvasWidth, canvasHeight) {
        // Create instances for all objects in the game
        this.ball = new Ball(new Vec(canvasWidth / 2 - 10, canvasHeight - 50),
                             10, "white");
        this.paddle = new Paddle(new Vec(canvasWidth / 2 - 50, canvasHeight - 30),
                             100, 15, "dodgerblue");
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 0;
        this.blocks = [];
        
        // Score display (usando nueva clase GameText)
        this.scoreLabel = new GameText(20, 30, 20, "white");
        this.livesLabel = new GameText(canvasWidth - 20, 30, 20, "white", "right");
        this.levelLabel = new GameText(canvasWidth / 2, 30, 20, "white", "center");
        
        // Game messages (usando nueva clase GameText)
        this.messageLabel = new GameText(canvasWidth / 2, canvasHeight / 2, 30, "white", "center");
        this.subtitleLabel = new GameText(canvasWidth / 2, canvasHeight / 2 + 40, 20, "#AAAAAA", "center");
        
        this.gameState = "start"; // Possible states: start, playing, gameover, win, levelCompleted
        this.levelTransitionTimer = 0;
        
        // Initialize sound effects
        this.initSoundEffects();
        
        // Create blocks for the first level
        this.loadLevel(this.currentLevel);
        
        // Create event listeners
        this.createEventListeners();
    }

    initSoundEffects() {
        // Initialize sound effects
        hitSoundEffect = new Audio();
        hitSoundEffect.src = "../assets/sfx/Pong_sfx/Pop.ogg";
        
        blockBreakSound = new Audio();
        blockBreakSound.src = "../assets/sfx/Pong_sfx/Score.ogg";
        
        levelUpSound = new Audio();
        levelUpSound.src = "../assets/sfx/Pong_sfx/Score.ogg"; // Reused sound for now
    }

    loadLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            // Player has completed all levels
            this.gameState = "win";
            return;
        }
        
        const level = levels[levelIndex];
        this.ball.setSpeedMultiplier(level.speed);
        this.blocks = this.createBlocks(level);
        
        // Resetear las vidas al cargar un nuevo nivel
        if (levelIndex > 0) {
            this.lives = 3;
        }
        
        // Reset flag
        this.livesRestored = false;
    }

    createBlocks(level) {
        let blocks = [];
        
        switch (level.pattern) {
            case "rectangle":
                // Standard rectangular pattern
                for (let row = 0; row < level.rows; row++) {
                    for (let col = 0; col < level.columns; col++) {
                        let blockX = col * (blockWidth + blockPadding) + blockOffsetLeft;
                        let blockY = row * (blockHeight + blockPadding) + blockOffsetTop;
                        
                        blocks.push(new Block(
                            new Vec(blockX, blockY),
                            blockWidth,
                            blockHeight,
                            blockColors[row % blockColors.length]
                        ));
                    }
                }
                break;
                
            case "pyramid":
                // Pyramid pattern
                for (let row = 0; row < level.rows; row++) {
                    // Calculate how many blocks to skip on each side to create pyramid
                    const blocksInRow = level.columns - row;
                    const offset = row * (blockWidth + blockPadding) / 2;
                    
                    for (let col = 0; col < blocksInRow; col++) {
                        let blockX = col * (blockWidth + blockPadding) + blockOffsetLeft + offset;
                        let blockY = row * (blockHeight + blockPadding) + blockOffsetTop;
                        
                        blocks.push(new Block(
                            new Vec(blockX, blockY),
                            blockWidth,
                            blockHeight,
                            blockColors[row % blockColors.length]
                        ));
                    }
                }
                break;
                
            case "checkerboard":
                // Checkerboard pattern
                for (let row = 0; row < level.rows; row++) {
                    for (let col = 0; col < level.columns; col++) {
                        // Skip blocks in a checkerboard pattern
                        if ((row + col) % 2 === 0) {
                            let blockX = col * (blockWidth + blockPadding) + blockOffsetLeft;
                            let blockY = row * (blockHeight + blockPadding) + blockOffsetTop;
                            
                            blocks.push(new Block(
                                new Vec(blockX, blockY),
                                blockWidth,
                                blockHeight,
                                blockColors[(row + col) % blockColors.length]
                            ));
                        }
                    }
                }
                break;
        }
        
        return blocks;
    }

    update(deltaTime) {
        if (this.gameState === "playing") {
            // Update game objects
            this.ball.update(deltaTime);
            this.paddle.update(deltaTime);
            
            // Check collisions
            this.checkPaddleCollision();
            this.checkBlockCollisions();
            this.checkGameOver();
            this.checkLevelComplete();
        } else if (this.gameState === "levelCompleted") {
            // Handle level transition
            this.levelTransitionTimer -= deltaTime;
            if (this.levelTransitionTimer <= 0) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
                this.ball.reset();
                this.gameState = "start";
            }
        }
    }
    
    checkPaddleCollision() {
        // Check if the ball has collided with the paddle
        if (boxOverlap(this.ball, this.paddle) && this.ball.velocity.y > 0) {
            // Ball hits paddle - bounce upward
            
            // Calculate where on the paddle the ball hit (0-1 value)
            const hitPosition = (this.ball.getCenter().x - this.paddle.position.x) / this.paddle.width;
            
            // Map the hit position to an angle (-60 to 60 degrees)
            const angle = (hitPosition - 0.5) * Math.PI * 2/3; // -60 to 60 degrees in radians
            
            // Set the new velocity based on angle, maintaining speed
            const speed = this.ball.velocity.magnitude();
            this.ball.velocity = new Vec(
                Math.sin(angle) * speed,
                -Math.cos(angle) * speed // Negative to go upward
            );
            
            // Play sound effect
            if (hitSoundEffect) hitSoundEffect.play();
        }
        
        // Check if ball falls below paddle
        if (this.ball.position.y > canvasHeight) {
            this.loseLife();
        }
    }
    
    checkBlockCollisions() {
        for (let block of this.blocks) {
            if (block.active && boxOverlap(this.ball, block)) {
                // Determine which side of the block was hit
                const ballCenter = this.ball.getCenter();
                const blockCenter = {
                    x: block.position.x + block.width / 2,
                    y: block.position.y + block.height / 2
                };
                
                // Calculate the collision normal
                const dx = ballCenter.x - blockCenter.x;
                const dy = ballCenter.y - blockCenter.y;
                
                // Determine if the collision was more horizontal or vertical
                if (Math.abs(dx) / block.width > Math.abs(dy) / block.height) {
                    // Horizontal collision, bounce left or right
                    this.ball.velocity.x = dx > 0 ? Math.abs(this.ball.velocity.x) : -Math.abs(this.ball.velocity.x);
                } else {
                    // Vertical collision, bounce up or down
                    this.ball.velocity.y = dy > 0 ? Math.abs(this.ball.velocity.y) : -Math.abs(this.ball.velocity.y);
                }
                
                // Deactivate the block
                block.active = false;
                
                // Increase score
                this.score += 10;
                
                // Speed up the ball slightly
                const currentSpeed = this.ball.velocity.magnitude();
                this.ball.velocity = this.ball.velocity.normalize().times(currentSpeed * ballSpeedIncrease);
                
                // Play sound effect
                if (blockBreakSound) blockBreakSound.play();
                
                // Only handle one collision per frame
                break;
            }
        }
    }
    
    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameState = "gameover";
        } else {
            this.ball.reset();
            this.ball.inPlay = false;
            this.gameState = "start";
        }
    }
    
    checkGameOver() {
        if (this.lives <= 0) {
            this.gameState = "gameover";
        }
    }
    
    checkLevelComplete() {
        // Check if all blocks have been destroyed
        const activeBlocks = this.blocks.filter(block => block.active);
        if (activeBlocks.length === 0) {
            if (this.currentLevel < levels.length - 1) {
                // More levels to play
                this.gameState = "levelCompleted";
                this.levelTransitionTimer = 3000; // 3 segundos para la transición
                if (levelUpSound) levelUpSound.play();
                
                // Mostrar un mensaje especial sobre las vidas
                this.livesRestored = true;
            } else {
                // All levels completed
                this.gameState = "win";
            }
        }
    }
    
    resetGame() {
        this.ball.reset();
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 0;
        this.loadLevel(this.currentLevel);
        this.gameState = "start";
    }

    draw(ctx) {
        // Draw background
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw all objects in the game
        this.paddle.draw(ctx);
        this.ball.draw(ctx);
        
        // Draw blocks
        for (let block of this.blocks) {
            if (block.active) {
                block.draw(ctx);
            }
        }
        
        // Draw UI elements - usando nueva clase GameText
        this.scoreLabel.draw(ctx, `Score: ${this.score}`);
        this.livesLabel.draw(ctx, `Lives: ${this.lives}`);
        
        // Show current level
        if (this.currentLevel < levels.length) {
            this.levelLabel.draw(ctx, `${levels[this.currentLevel].name}`);
        }
        
        // Draw messages based on game state
        if (this.gameState === "start") {
            this.messageLabel.draw(ctx, "Press SPACE to start");
            if (this.currentLevel > 0) {
                this.subtitleLabel.draw(ctx, `Level ${this.currentLevel + 1} of ${levels.length}`);
            }
        } else if (this.gameState === "gameover") {
            this.messageLabel.draw(ctx, "GAME OVER");
            this.subtitleLabel.draw(ctx, "Press R to restart");
        } else if (this.gameState === "win") {
            this.messageLabel.draw(ctx, "YOU WIN!");
            this.subtitleLabel.draw(ctx, "Press R to play again");
        } else if (this.gameState === "levelCompleted") {
            this.messageLabel.draw(ctx, "LEVEL COMPLETED!");
            if (this.livesRestored) {
                this.subtitleLabel.draw(ctx, `Next level in ${Math.ceil(this.levelTransitionTimer/1000)}... Lives restored!`);
            } else {
                this.subtitleLabel.draw(ctx, `Next level in ${Math.ceil(this.levelTransitionTimer/1000)}...`);
            }
        }
    }

    createEventListeners() {
        // Keyboard event listeners for paddle movement
        window.addEventListener('keydown', (event) => {
            // Space key to start the game
            if (event.key === " " || event.code === "Space") {
                if (this.gameState === "start" && !this.ball.inPlay) {
                    this.gameState = "playing";
                    this.ball.initVelocity();
                }
            }
            
            // R key to restart the game
            if (event.key === "r" || event.key === "R") {
                if (this.gameState === "gameover" || this.gameState === "win") {
                    this.resetGame();
                }
            }
            
            // Arrow keys for paddle movement
            if (event.key === "ArrowLeft" || event.key === "Left") {
                this.paddle.setLeftPressed(true);
            }
            if (event.key === "ArrowRight" || event.key === "Right") {
                this.paddle.setRightPressed(true);
            }
        });
        
        window.addEventListener('keyup', (event) => {
            // Arrow keys for paddle movement
            if (event.key === "ArrowLeft" || event.key === "Left") {
                this.paddle.setLeftPressed(false);
            }
            if (event.key === "ArrowRight" || event.key === "Right") {
                this.paddle.setRightPressed(false);
            }
        });
    }
}

function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create a new game instance
    game = new Game(canvasWidth, canvasHeight);

    // Start the game loop
    drawScene(0);
}

function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update all game objects
    game.update(deltaTime);

    // Draw all game objects
    game.draw(ctx);

    // Update the time for the next frame
    oldTime = newTime;
    requestAnimationFrame(drawScene);
} 