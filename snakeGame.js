// ==========================================
// SNAKE GAME LOGIC CLASS
// ==========================================

class SnakeGame {
    constructor(boardSize = 20) {
        this.boardSize = boardSize;
        this.board = this.createBoard();
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 0, y: 0 };
        this.lifePowerUp = null;
        this.direction = 'right';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.foodsEaten = 0;
        this.gameOver = false;
        this.isBlinking = false;
        this.blinkStartTime = 0;
        this.lifePowerUpTimer = 0;
        this.gameSpeed = 100;
        this.isPaused = false; // Track if movement is paused
        this.waitingForInput = false; // Track if waiting for user input after collision
        // Initialize game
        this.createFood();
    }

    createBoard() {
        const board = [];
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize).fill(0);
        }
        return board;
    }

    createFood() {
        do {
            this.food.x = Math.floor(Math.random() * this.boardSize);
            this.food.y = Math.floor(Math.random() * this.boardSize);
        } while (this.isPositionOccupied(this.food.x, this.food.y));
    }

    createLifePowerUp() {
        do {
            this.lifePowerUp = {
                x: Math.floor(Math.random() * this.boardSize),
                y: Math.floor(Math.random() * this.boardSize)
            };
        } while (
            this.isPositionOccupied(this.lifePowerUp.x, this.lifePowerUp.y) ||
            (this.lifePowerUp.x === this.food.x && this.lifePowerUp.y === this.food.y)
        );
        this.lifePowerUpTimer = Date.now();
    }

    isPositionOccupied(x, y) {
        return this.snake.some(segment => segment.x === x && segment.y === y);
    }

    // Movement methods
    goUp() { this.setDirection('up'); }
    goDown() { this.setDirection('down'); }
    goLeft() { this.setDirection('left'); }
    goRight() { this.setDirection('right'); }

    setDirection(newDirection) {
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (newDirection !== opposites[this.direction]) {
            this.direction = newDirection;
        }
    }

    move() {
        if (this.gameOver || this.isPaused || this.waitingForInput) return false;
        const head = { ...this.snake[0] };
        // Calculate new head position
        switch (this.direction) {
            case 'up': head.y -= 1; break;
            case 'down': head.y += 1; break;
            case 'left': head.x -= 1; break;
            case 'right': head.x += 1; break;
        }
        // Handle wall collision - teleport to opposite side
        let hitWall = false;
        if (head.x < 0) {
            head.x = this.boardSize - 1;
            hitWall = true;
        } else if (head.x >= this.boardSize) {
            head.x = 0;
            hitWall = true;
        } else if (head.y < 0) {
            head.y = this.boardSize - 1;
            hitWall = true;
        } else if (head.y >= this.boardSize) {
            head.y = 0;
            hitWall = true;
        }
        this.snake.unshift(head);
        // Check for self collision
        const hitSelf = this.snake.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
        // Handle collisions that cost lives
        if ((hitWall || hitSelf) && !this.isBlinking) {
            this.loseLife();
            if (this.gameOver) return false;
            // Stop movement and wait for user input after collision
            this.waitingForInput = true;
            return false;
        }
        // Check for food consumption
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }
        // Check for life power-up consumption
        if (this.lifePowerUp && head.x === this.lifePowerUp.x && head.y === this.lifePowerUp.y) {
            this.gainLife();
        }
        return true;
    }

    eatFood() {
        this.score += 1;
        this.foodsEaten += 1;
        this.createFood();
        // Check if life power-up should appear
        if (this.foodsEaten % 5 === 0) {
            this.createLifePowerUp();
        }
        // Check for level up
        if (this.score > 0 && this.score % 10 === 0) {
            this.levelUp();
        }
    }

    gainLife() {
        this.lives += 1;
        this.lifePowerUp = null;
        this.lifePowerUpTimer = 0;
    }

    loseLife() {
        this.lives -= 1;
        if (this.lives <= 0) {
            this.gameOver = true;
            return;
        }
        // Start blinking effect
        this.isBlinking = true;
        this.blinkStartTime = Date.now();
    }

    levelUp() {
        this.level += 1;
        this.gameSpeed = Math.max(40, 100 - (this.level - 1) * 10);
        return true; // Signal that level up occurred
    }

    updateBlinking() {
        if (this.isBlinking) {
            const elapsed = Date.now() - this.blinkStartTime;
            if (elapsed >= 2000) { // 2 seconds
                this.isBlinking = false;
            }
        }
    }

    updateLifePowerUp() {
        if (this.lifePowerUp) {
            const elapsed = Date.now() - this.lifePowerUpTimer;
            if (elapsed >= 3000) { // 3 seconds
                this.lifePowerUp = null;
                this.lifePowerUpTimer = 0;
            }
        }
    }

    shouldSnakeBlink() {
        if (!this.isBlinking) return false;
        const elapsed = Date.now() - this.blinkStartTime;
        const blinkInterval = 200; // 200ms intervals
        return Math.floor(elapsed / blinkInterval) % 2 === 0;
    }

    shouldHeadBlinkRed() {
        if (!this.isBlinking) return false;
        const elapsed = Date.now() - this.blinkStartTime;
        const blinkInterval = 200; // 200ms intervals
        return Math.floor(elapsed / blinkInterval) % 2 === 0;
    }

    getLifePowerUpPulse() {
        if (!this.lifePowerUp) return 0;
        const elapsed = Date.now() - this.lifePowerUpTimer;
        return Math.sin(elapsed / 100) * 0.3 + 0.7;
    }

    restart() {
        this.snake = [{ x: 10, y: 10 }];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.direction = 'right';
        this.gameOver = false;
        this.isBlinking = false;
        this.blinkStartTime = 0;
        this.lifePowerUp = null;
        this.lifePowerUpTimer = 0;
        this.foodsEaten = 0;
        this.gameSpeed = 100;
        this.isPaused = false;
        this.waitingForInput = false;
        this.createFood();
    }

    update() {
        this.updateBlinking();
        this.updateLifePowerUp();
    }

    // Pause/Resume methods
    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    // Resume movement after collision when user presses directional key
    resumeAfterInput() {
        this.waitingForInput = false;
    }

    // Check if snake should not move
    isMovementBlocked() {
        return this.gameOver || this.isPaused || this.waitingForInput;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SnakeGame;
}
