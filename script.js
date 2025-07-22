// ==========================================
// GAME RENDERER AND UI CLASS
// ==========================================

class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
    }

    clearCanvas(level = 1) {
        this.ctx.fillStyle = this.getBackgroundColor(level);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getBackgroundColor(level) {
        // Define different background colors for each level
        const levelColors = [
            '#a8d5e5', // Level 1
            '#5a9fd4', // Level 2
            '#4a8fc4', // Level 3
            '#3a7fb4', // Level 4
            '#2a6fa4', // Level 5
            '#1a5f94'  // Level 6
        ];
        
        // For levels beyond predefined colors, use the last color
        if (level <= levelColors.length) {
            return levelColors[level - 1];
        } else {
            // For very high levels, create a gradient towards darker colors
            const baseIndex = levelColors.length - 1;
            return levelColors[baseIndex];
        }
    }

    drawSnake(snake, shouldBlink = false, shouldHeadBlinkRed = false) {
        const headColor = shouldHeadBlinkRed ? '#FF0000' : '#FFD700'; // Red when blinking, gold otherwise
        const headBorder = shouldHeadBlinkRed ? '#8B0000' : '#B8860B';
        const tailColorStart = { r: 76, g: 175, b: 80 }; // #4CAF50
        const tailColorEnd = { r: 200, g: 255, b: 200 }; // Light green
        const tailBorderStart = { r: 46, g: 139, b: 87 }; // #2E8B57
        const tailBorderEnd = { r: 180, g: 220, b: 180 }; // Light border
        const len = snake.length;

        snake.forEach((segment, idx) => {
            if (idx === 0) {
                // Head of the snake
                this.ctx.fillStyle = headColor;
                this.ctx.strokeStyle = headBorder;
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
                this.ctx.strokeRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            } else {
                // Interpolate color for body
                const t = (idx) / (len - 1);
                const r = Math.round(tailColorStart.r + t * (tailColorEnd.r - tailColorStart.r));
                const g = Math.round(tailColorStart.g + t * (tailColorEnd.g - tailColorStart.g));
                const b = Math.round(tailColorStart.b + t * (tailColorEnd.b - tailColorStart.b));
                this.ctx.fillStyle = `rgb(${r},${g},${b})`;
                // Only fill the body segments, no stroke/border
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            }
        });
    }

    drawFood(food) {
        this.ctx.fillStyle = '#FF4136';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.fillRect(food.x * this.gridSize, food.y * this.gridSize, this.gridSize, this.gridSize);
        this.ctx.strokeRect(food.x * this.gridSize, food.y * this.gridSize, this.gridSize, this.gridSize);
    }

    drawLifePowerUp(lifePowerUp, pulseIntensity) {
        if (!lifePowerUp) return;
        
        this.ctx.fillStyle = `rgba(255, 20, 147, ${pulseIntensity})`;
        this.ctx.strokeStyle = '#8B0040';
        
        const x = lifePowerUp.x * this.gridSize;
        const y = lifePowerUp.y * this.gridSize;
        const size = this.gridSize;
        const crossWidth = size * 0.2;
        
        // Vertical bar
        this.ctx.fillRect(x + size * 0.4, y, crossWidth, size);
        this.ctx.strokeRect(x + size * 0.4, y, crossWidth, size);
        
        // Horizontal bar
        this.ctx.fillRect(x, y + size * 0.4, size, crossWidth);
        this.ctx.strokeRect(x, y + size * 0.4, size, crossWidth);
    }

    drawGameOver(score, getText, level = 1) {
        // Keep the level background visible with transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(getText('gameOver'), this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${getText('finalScore')} ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    drawStartScreen(getText, level = 1) {
        // Keep the level background visible with transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(getText('snakeGameTitle'), this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(getText('pressDirectional'), this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText(getText('toStart'), this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillText(getText('useArrows'), this.canvas.width / 2, this.canvas.height / 2 + 60);
        this.ctx.fillText(getText('pressPause'), this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    drawPauseScreen(getText, level = 1) {
        // Keep the level background visible, just add transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(getText('paused'), this.canvas.width / 2, this.canvas.height / 2);
    }

    drawLevelUpScreen(text, level = 1) {
        // Clear canvas with the new level background color
        this.clearCanvas(level);
        
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '50px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    }
}

// ==========================================
// MAIN GAME CONTROLLER
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Game instances
    const game = new SnakeGame(20);
    const renderer = new GameRenderer('gameCanvas');
    
    // UI elements
    let scoreElement, levelElement, restartButton, flagBR, flagUS, livesElement, arrowIndicator;
    
    // Game state (UI only)
    let gameStarted = false;
    let isPaused = false;
    let isLevelingUp = false;
    let directionQueue = [];
    let lastKeyPressed = '';
    let currentLanguage = localStorage.getItem('snakeGameLanguage') || 'pt-BR';

    // Language translations
    const translations = {
        'pt-BR': {
            gameTitle: 'Jogo da Cobrinha',
            scoreLabel: 'Pontuação:',
            levelLabel: 'Nível:',
            livesLabel: 'Vidas:',
            restartButton: 'Reiniciar',
            gameOver: 'Fim de Jogo',
            finalScore: 'Pontuação Final:',
            paused: 'Pausado',
            snakeGameTitle: 'Jogo da Cobrinha',
            pressDirectional: 'Pressione uma tecla direcional',
            toStart: 'para começar!',
            useArrows: 'Use ↑↓←→ ou WASD para mover',
            pressPause: 'Pressione P para pausar',
            level: 'Nível',
            go: 'Vai!'
        },
        'en-US': {
            gameTitle: 'Snake Game',
            scoreLabel: 'Score:',
            levelLabel: 'Level:',
            livesLabel: 'Lives:',
            restartButton: 'Restart',
            gameOver: 'Game Over',
            finalScore: 'Final Score:',
            paused: 'Paused',
            snakeGameTitle: 'Snake Game',
            pressDirectional: 'Press a directional key',
            toStart: 'to start!',
            useArrows: 'Use ↑↓←→ or WASD to move',
            pressPause: 'Press P to pause',
            level: 'Level',
            go: 'Go!'
        }
    };

    function getText(key) {
        return translations[currentLanguage][key];
    }

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];
        
        document.getElementById('game-title').textContent = t.gameTitle;
        document.getElementById('score-label').textContent = t.scoreLabel;
        document.getElementById('level-label').textContent = t.levelLabel;
        if (document.getElementById('lives-label')) document.getElementById('lives-label').textContent = t.livesLabel;
        if (restartButton) restartButton.textContent = t.restartButton;
        document.title = t.gameTitle;
        document.documentElement.lang = lang;
        
        if (flagBR) flagBR.classList.toggle('active', lang === 'pt-BR');
        if (flagUS) flagUS.classList.toggle('active', lang === 'en-US');
        
        localStorage.setItem('snakeGameLanguage', lang);
        
        if (!gameStarted || game.gameOver || isPaused) {
            main();
        }
    }

    function updateUI() {
        if (scoreElement) scoreElement.textContent = game.score;
        if (levelElement) levelElement.textContent = game.level;
        if (livesElement) livesElement.textContent = game.lives;
    }

    function showArrow(direction) {
        const arrows = { up: '▲', down: '▼', left: '◀', right: '▶' };
        const arrow = arrows[direction] || '';
        if (arrowIndicator && arrow) {
            arrowIndicator.innerHTML = `<span style="font-size: 100px; color: #222; text-shadow: 2px 2px 8px #fff;">${arrow}</span>`;
        }
    }

    function clearArrow() {
        if (arrowIndicator) arrowIndicator.innerHTML = '';
    }

    function changeDirection(event) {
        // Prevent default behavior and stop propagation
        event.preventDefault();
        
        const keyPressed = event.key.toLowerCase();
        
        // Ignore repeated key presses (when user holds a key)
        if (keyPressed === lastKeyPressed && event.repeat) {
            return;
        }
        lastKeyPressed = keyPressed;
        
        let direction = null;
        
        if (keyPressed === 'arrowup' || keyPressed === 'w') direction = 'up';
        else if (keyPressed === 'arrowdown' || keyPressed === 's') direction = 'down';
        else if (keyPressed === 'arrowleft' || keyPressed === 'a') direction = 'left';
        else if (keyPressed === 'arrowright' || keyPressed === 'd') direction = 'right';
        
        if (direction) {
            showArrow(direction);
            
            if (!gameStarted) {
                gameStarted = true;
                main();
                return;
            }
            
            if (!isPaused && !isLevelingUp && !game.gameOver) {
                // Clear the queue if it's getting too long and add the new direction
                if (directionQueue.length >= 2) {
                    directionQueue = [direction];
                } else {
                    // Only add if it's different from the last direction in queue
                    const lastDirection = directionQueue[directionQueue.length - 1] || game.direction;
                    if (direction !== lastDirection) {
                        directionQueue.push(direction);
                    }
                }
            }
        }
        
        if (keyPressed === 'p' && gameStarted) {
            togglePause();
        }
    }

    function handleKeyUp(event) {
        const keyPressed = event.key.toLowerCase();
        
        // Clear last key when released
        if (keyPressed === lastKeyPressed) {
            lastKeyPressed = '';
        }
        
        clearArrow();
    }

    function togglePause() {
        if (game.gameOver || isLevelingUp) return;
        isPaused = !isPaused;
        if (!isPaused) main();
    }

    function restartGame() {
        game.restart();
        isLevelingUp = false;
        isPaused = false;
        gameStarted = false;
        directionQueue = [];
        lastKeyPressed = '';
        updateUI();
        if (restartButton) restartButton.style.display = 'none';
        main();
    }

    // Game loop
    let lastFrameTime = 0;
    let frameAccumulator = 0;

    function gameLoop(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        frameAccumulator += delta;

        if (game.gameOver) {
            renderer.clearCanvas(game.level);
            renderer.drawFood(game.food);
            renderer.drawLifePowerUp(game.lifePowerUp, game.getLifePowerUpPulse());
            renderer.drawSnake(game.snake, false, false);
            renderer.drawGameOver(game.score, getText, game.level);
            if (restartButton) restartButton.style.display = 'block';
            return;
        }

        if (!gameStarted) {
            renderer.clearCanvas(game.level);
            renderer.drawFood(game.food);
            renderer.drawLifePowerUp(game.lifePowerUp, game.getLifePowerUpPulse());
            renderer.drawSnake(game.snake, false, false);
            renderer.drawStartScreen(getText, game.level);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (isPaused) {
            renderer.drawPauseScreen(getText, game.level);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (isLevelingUp) {
            requestAnimationFrame(gameLoop);
            return;
        }

        if (frameAccumulator >= game.gameSpeed) {
            game.update();
            
            if (directionQueue.length > 0) {
                const newDirection = directionQueue.shift();
                game.setDirection(newDirection);
            }
            
            const moved = game.move();
            if (!moved) {
                requestAnimationFrame(gameLoop);
                return;
            }

            if (game.score > 0 && game.score % 10 === 0 && game.score / 10 === game.level) {
                startLevelUpSequence();
                return;
            }

            updateUI();
            renderer.clearCanvas(game.level);
            renderer.drawFood(game.food);
            renderer.drawLifePowerUp(game.lifePowerUp, game.getLifePowerUpPulse());
            renderer.drawSnake(game.snake, false, game.shouldHeadBlinkRed());
            frameAccumulator = 0;
        }
        requestAnimationFrame(gameLoop);
    }

    function main() {
        lastFrameTime = 0;
        frameAccumulator = 0;
        requestAnimationFrame(gameLoop);
    }

    function startLevelUpSequence() {
        isLevelingUp = true;
        game.levelUp();
        updateUI();
        
        let levelUpStart = null;
        function levelUpFrame(ts) {
            if (!levelUpStart) levelUpStart = ts;
            const elapsed = ts - levelUpStart;
            
            if (elapsed < 1000) {
                renderer.drawLevelUpScreen(`${getText('level')} ${game.level}`, game.level);
            } else if (elapsed < 4000) {
                const sec = 3 - Math.floor((elapsed - 1000) / 1000);
                renderer.drawLevelUpScreen(sec > 0 ? sec : getText('go'), game.level);
            } else {
                isLevelingUp = false;
                main();
                return;
            }
            requestAnimationFrame(levelUpFrame);
        }
        requestAnimationFrame(levelUpFrame);
    }

    // Initialize
    setTimeout(() => {
        scoreElement = document.getElementById('score');
        levelElement = document.getElementById('level');
        livesElement = document.getElementById('lives');
        restartButton = document.getElementById('restartButton');
        flagBR = document.getElementById('flag-br');
        flagUS = document.getElementById('flag-us');
        arrowIndicator = document.getElementById('arrow-indicator');

        document.addEventListener('keydown', changeDirection);
        document.addEventListener('keyup', handleKeyUp);
        if (restartButton) restartButton.addEventListener('click', restartGame);
        if (flagBR) flagBR.addEventListener('click', () => updateLanguage('pt-BR'));
        if (flagUS) flagUS.addEventListener('click', () => updateLanguage('en-US'));

        updateLanguage(currentLanguage);
        main();
    }, 100);
});
