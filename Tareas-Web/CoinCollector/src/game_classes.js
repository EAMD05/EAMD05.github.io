/**
 * @file game_classes.js
 * @description Contains the core game classes and utilities for the game
 * @author Erick Alonso Morales Dieguez
 * @version 1.0.0
 */

/**
 * Vector class for 2D position and movement calculations
 */
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add two vectors
     * @param {Vec} other - Vector to add
     * @returns {Vec} Resulting vector
     */
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    /**
     * Subtract two vectors
     * @param {Vec} other - Vector to subtract
     * @returns {Vec} Resulting vector
     */
    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    /**
     * Multiply vector by a scalar
     * @param {number} scalar - Scalar value to multiply by
     * @returns {Vec} Resulting vector
     */
    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    /**
     * Calculate vector magnitude
     * @returns {number} Magnitude of the vector
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Normalize vector to unit length
     * @returns {Vec} Normalized vector
     */
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
}


/*
 * Test the Vector class
 */
//let p = new Vec(0, 8);
//let v = new Vec(1, 1);
//p = p.plus(v.times(1));
//console.log("New position: ", p);
//console.log("plus: ", p.plus(v));
//console.log("minus: ", p.minus(v));
//console.log("times: ", p.times(3));
//console.log("magnitude: ", p.magnitude());

/**
 * Rectangle class for sprite and collision detection
 */
class Rect {
    /**
     * Create a new rectangle
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Width of the rectangle
     * @param {number} height - Height of the rectangle
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


/**
 * Base class for all game objects
 */
class GameObject {
    /**
     * Create a new game object
     * @param {Vec} position - Initial position
     * @param {number} width - Width of the object
     * @param {number} height - Height of the object
     * @param {string} color - Color of the object
     * @param {string} type - Type identifier
     */
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }

    /**
     * Set sprite image and source rectangle
     * @param {string} imagePath - Path to the sprite image
     * @param {Rect} rect - Source rectangle for sprite sheet
     */
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    /**
     * Draw the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(
                    this.spriteImage,
                    this.spriteRect.x * this.spriteRect.width,
                    this.spriteRect.y * this.spriteRect.height,
                    this.spriteRect.width,
                    this.spriteRect.height,
                    this.position.x,
                    this.position.y,
                    this.width,
                    this.height
                );
            } else {
                ctx.drawImage(
                    this.spriteImage,
                    this.position.x,
                    this.position.y,
                    this.width,
                    this.height
                );
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }

        this.drawBoundingBox(ctx);
    }

    /**
     * Draw bounding box for debugging
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.stroke();
    }

    /**
     * Update method to be overridden by subclasses
     */
    update() {

    }
}


// Update 2025-03-12
/**
 * Class for objects with sprite animations
 */
class AnimatedObject extends GameObject {
    /**
     * Create a new animated object
     * @param {Vec} position - Initial position
     * @param {number} width - Width of the object
     * @param {number} height - Height of the object
     * @param {string} color - Color of the object
     * @param {string} type - Type identifier
     * @param {number} sheetCols - Number of columns in sprite sheet
     */
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    /**
     * Configure animation parameters
     * @param {number} minFrame - Starting frame index
     * @param {number} maxFrame - Ending frame index
     * @param {boolean} repeat - Whether to loop the animation
     * @param {number} duration - Duration of each frame in milliseconds
     */
    setAnimation(minFrame, maxFrame, repeat, duration) {
        //console.log(`Setting animation to ${minFrame}, ${maxFrame}`);
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    /**
     * Update animation frame based on elapsed time
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            const restartFrame = (this.repeat ? this.minFrame : this.frame);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}

/**
 * Class for text labels in the game
 */
class TextLabel {
    /**
     * Create a new text label
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} font - Font style
     * @param {string} color - Text color
     */
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    /**
     * Draw text on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {string} text - Text to display
     */
    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}


/**
 * Check for collision between two rectangular objects
 * @param {GameObject} obj1 - First object
 * @param {GameObject} obj2 - Second object
 * @returns {boolean} True if objects overlap
 */
function boxOverlap(obj1, obj2) {
    return obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.y + obj1.height > obj2.position.y &&
           obj1.position.y < obj2.position.y + obj2.height;
}
