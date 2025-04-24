/**
 * @file practice_sprite_animations.js
 * @description Main game file containing game initialization, game loop, and core game logic
 * @author Erick Alonso Morales Dieguez
 * @version 1.0.0
 */

"use strict";

// Canvas configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Game state variables
let canvasContext;
let gameInstance;
let previousFrameTime;

// Game settings
const PLAYER_MOVEMENT_SPEED = 0.5;
const ANIMATION_FRAME_DELAY = 75;

// Keyboard input mapping
const KEYBOARD_CONTROLS = {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
};

// Player animation states configuration
const PLAYER_ANIMATION_STATES = {
    up: {
        axis: "y",
        direction: -1,
        frames: [0, 2],
        repeat: true,
        duration: ANIMATION_FRAME_DELAY
    },
    down: {
        axis: "y",
        direction: 1,
        frames: [6, 8],
        repeat: true,
        duration: ANIMATION_FRAME_DELAY
    },
    left: {
        axis: "x",
        direction: -1,
        frames: [9, 11],
        repeat: true,
        duration: ANIMATION_FRAME_DELAY
    },
    right: {
        axis: "x",
        direction: 1,
        frames: [3, 5],
        repeat: true,
        duration: ANIMATION_FRAME_DELAY
    },
    idle: {
        axis: "y",
        direction: 0,
        frames: [7, 7],
        repeat: true,
        duration: ANIMATION_FRAME_DELAY
    }
};

/**
 * Player class representing the main character
 */
class Player extends AnimatedObject {
    /**
     * Create a new player
     * @param {Vec} position - Initial position
     * @param {number} width - Width of the player
     * @param {number} height - Height of the player
     * @param {string} color - Color of the player
     * @param {number} sheetCols - Number of columns in sprite sheet
     */
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vec(0, 0);
        this.keys = [];
        this.previousDirection = "down";
        this.currentDirection = "down";
    }

    /**
     * Update player state
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        this.setVelocity();
        this.setMovementAnimation();
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.constrainToCanvas();
        this.updateFrame(deltaTime);
    }

    /**
     * Keep player within canvas boundaries
     */
    constrainToCanvas() {
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > CANVAS_HEIGHT) {
            this.position.y = CANVAS_HEIGHT - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > CANVAS_WIDTH) {
            this.position.x = CANVAS_WIDTH - this.width;
        }
    }

    /**
     * Set player velocity based on pressed keys
     */
    setVelocity() {
        this.velocity = new Vec(0, 0);
        for (const key of this.keys) {
            const move = PLAYER_ANIMATION_STATES[key];
            this.velocity[move.axis] += move.direction;
        }
        this.velocity = this.velocity.normalize().times(PLAYER_MOVEMENT_SPEED);
    }

    /**
     * Set appropriate animation based on movement direction
     */
    setMovementAnimation() {
        if (Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {
            if (this.velocity.y > 0) {
                this.currentDirection = "down";
            } else if (this.velocity.y < 0) {
                this.currentDirection = "up";
            } else {
                this.currentDirection = "idle";
            }
        } else {
            if (this.velocity.x > 0) {
                this.currentDirection = "right";
            } else if (this.velocity.x < 0) {
                this.currentDirection = "left";
            } else {
                this.currentDirection = "idle";
            }
        }

        if (this.currentDirection !== this.previousDirection) {
            const anim = PLAYER_ANIMATION_STATES[this.currentDirection];
            this.setAnimation(...anim.frames, anim.repeat, anim.duration);
        }

        this.previousDirection = this.currentDirection;
    }
}

/**
 * Coin class representing collectible items
 */
class Coin extends AnimatedObject {
    /**
     * Create a new coin
     * @param {Vec} position - Initial position
     * @param {number} width - Width of the coin
     * @param {number} height - Height of the coin
     * @param {string} color - Color of the coin
     * @param {string} type - Type identifier
     * @param {number} sheetCols - Number of columns in sprite sheet
     */
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type, sheetCols);
        this.spriteRect = new Rect(0, 0, 32, 32);
    }

    /**
     * Update coin state
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        this.updateFrame(deltaTime);
    }
}

/**
 * Main game class
 */
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    /**
     * Initialize game objects
     */
    initObjects() {
        this.player = new Player(
            new Vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
            60,
            60,
            "red",
            3
        );
        this.player.setSprite(
            'assets/images/blordrough_quartermaster-NESW.png',
            new Rect(48, 128, 48, 64)
        );
        this.player.setAnimation(7, 7, false, ANIMATION_FRAME_DELAY);
        
        this.coins = [
            new Coin(new Vec(600, 200), 32, 32, "yellow", "coin", 8),
            new Coin(new Vec(200, 300), 32, 32, "yellow", "coin", 8),
            new Coin(new Vec(400, 100), 32, 32, "yellow", "coin", 8),
            new Coin(new Vec(100, 400), 32, 32, "yellow", "coin", 8)
        ];

        for (const coin of this.coins) {
            coin.setSprite('assets/images/coin_gold.png', new Rect(0, 0, 32, 32));
            coin.setAnimation(0, 7, true, 400);
        }

        this.actors = [...this.coins];
    }

    /**
     * Reset the game to its initial state
     */
    restart() {
        this.initObjects();
    }

    /**
     * Draw game state
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        for (const actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    /**
     * Update game state
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (boxOverlap(this.player, this.coins[i])) {
                const index = this.actors.indexOf(this.coins[i]);
                if (index > -1) {
                    this.actors.splice(index, 1);
                }
                this.coins.splice(i, 1);
            }
        }

        for (const actor of this.actors) {
            actor.update(deltaTime);
        }
        this.player.update(deltaTime);
    }

    /**
     * Create event listeners for keyboard input and UI
     */
    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (Object.keys(KEYBOARD_CONTROLS).includes(event.key)) {
                this.addKey(KEYBOARD_CONTROLS[event.key]);
            }
        });

        window.addEventListener('keyup', (event) => {
            if (Object.keys(KEYBOARD_CONTROLS).includes(event.key)) {
                this.removeKey(KEYBOARD_CONTROLS[event.key]);
            }
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restart();
        });
    }

    /**
     * Add key to pressed keys list
     * @param {string} direction - Movement direction
     */
    addKey(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    /**
     * Remove key from pressed keys list
     * @param {string} direction - Movement direction
     */
    removeKey(direction) {
        const index = this.player.keys.indexOf(direction);
        if (index !== -1) {
            this.player.keys.splice(index, 1);
        }
    }
}

/**
 * Initialize the game
 */
function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasContext = canvas.getContext('2d');

    gameInstance = new Game();
    drawScene(0);
}

/**
 * Main game loop
 * @param {number} newTime - Current timestamp
 */
function drawScene(newTime) {
    if (previousFrameTime === undefined) {
        previousFrameTime = newTime;
    }
    const deltaTime = newTime - previousFrameTime;

    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameInstance.draw(canvasContext);
    gameInstance.update(deltaTime);

    previousFrameTime = newTime;
    requestAnimationFrame(drawScene);
}
