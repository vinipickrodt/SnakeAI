document.addEventListener('DOMContentLoaded', () => {
    // Game State Variables (declare early to avoid reference errors)
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let score = 0;
    let level = 1;
    let direction = 'right';
    let gameOver = false;
    let isLevelingUp = false;
    let isPaused = false;
    let gameStarted = false; // New state for game initialization
    let gameSpeed = 100; // milliseconds
    let directionQueue = [];
    let gameLoopTimeout;

    // Canvas and context variables (declare in global scope)
    let canvas, ctx, scoreElement, levelElement, restartButton, flagBR, flagUS;
    let gridSize, tileCount;

    // Language system
    let currentLanguage = 'pt-BR';
    
    const translations = {
        'pt-BR': {
            gameTitle: 'Jogo da Cobrinha',
            scoreLabel: 'Pontuação:',
            levelLabel: 'Nível:',
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

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];
        
        // Update HTML elements
        document.getElementById('game-title').textContent = t.gameTitle;
        document.getElementById('score-label').textContent = t.scoreLabel;
        document.getElementById('level-label').textContent = t.levelLabel;
        if (restartButton) restartButton.textContent = t.restartButton;
        document.title = t.gameTitle;
        document.documentElement.lang = lang;
        
        // Update flag states
        if (flagBR) flagBR.classList.toggle('active', lang === 'pt-BR');
        if (flagUS) flagUS.classList.toggle('active', lang === 'en-US');
        
        // Redraw current screen if game is not running
        if (!gameStarted || gameOver || isPaused) {
            if (canvas && ctx) main();
        }
    }

    function getText(key) {
        return translations[currentLanguage][key];
    }

    function main() {
        console.log('Main called - gameOver:', gameOver, 'gameStarted:', gameStarted, 'isLevelingUp:', isLevelingUp);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(getText('gameOver'), canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px Arial';
            ctx.fillText(`${getText('finalScore')} ${score}`, canvas.width / 2, canvas.height / 2 + 20);
            if (restartButton) restartButton.style.display = 'block';
            return;
        }

        if (!gameStarted) {
            console.log('Game not started, calling drawStartScreen');
            drawStartScreen();
            return;
        }

        if (isLevelingUp) {
            // The level up sequence is a blocking animation that takes over.
            // Just return without doing anything, the sequence is already running
            return;
        }

        gameLoopTimeout = setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, gameSpeed);
    }

    function drawStartScreen() {
        console.log('Drawing start screen...');
        console.log('gameStarted:', gameStarted);
        console.log('canvas:', canvas);
        console.log('ctx:', ctx);
        
        // Draw the game state in the background
        clearCanvas();
        drawFood();
        drawSnake();

        // Draw overlay and instructions
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getText('snakeGameTitle'), canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = '20px Arial';
        ctx.fillText(getText('pressDirectional'), canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(getText('toStart'), canvas.width / 2, canvas.height / 2 + 20);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ccc';
        ctx.fillText(getText('useArrows'), canvas.width / 2, canvas.height / 2 + 60);
        ctx.fillText(getText('pressPause'), canvas.width / 2, canvas.height / 2 + 80);
        
        console.log('Start screen drawn');
    }

    function drawPauseScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';   
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getText('paused'), canvas.width / 2, canvas.height / 2);
    }

    function togglePause() {
        if (gameOver || isLevelingUp) return;

        isPaused = !isPaused;
        if (isPaused) {
            clearTimeout(gameLoopTimeout);
            drawPauseScreen();
        } else {
            main(); // Resume game
        }
    }

    function startLevelUpSequence() {
        console.log('Starting level up sequence, current level:', level);
        clearTimeout(gameLoopTimeout); // Ensure no game loops are running
        level++;
        if (levelElement) {
            levelElement.textContent = level;
        } else {
            console.error('levelElement is null!');
        }
        console.log('New level:', level);
        // Speed up the game, but with a minimum speed (e.g., 40ms)
        gameSpeed = Math.max(40, 100 - (level - 1) * 10);
        console.log('New game speed:', gameSpeed);

        let countdown = 3;

        function drawLevelUpScreen(text) {
            // Redraw the current game state underneath the message
            clearCanvas();
            drawFood();
            drawSnake();

            // Draw overlay and text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }

        drawLevelUpScreen(`${getText('level')} ${level}`);

        setTimeout(() => {
            const countdownInterval = setInterval(() => {
                if (countdown > 0) {
                    drawLevelUpScreen(countdown--);
                } else {
                    clearInterval(countdownInterval);
                    drawLevelUpScreen(getText('go'));
                    setTimeout(() => {
                        console.log('Level up sequence complete, resuming game');
                        isLevelingUp = false;
                        main(); // Resume the game
                    }, 750); // Show "Go!" for a moment
                }
            }, 1000);
        }, 2000); // Show "Level X" for 2 seconds
    }

    function clearCanvas() {
        ctx.fillStyle = '#a8d5e5'; // A light blue background from CSS
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function drawSnakePart(snakePart) {
        ctx.fillStyle = '#4CAF50'; // Green snake
        ctx.strokeStyle = '#2E8B57'; // Darker green border
        ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
    }

    function drawFood() {
        ctx.fillStyle = '#FF4136'; // Red food
        ctx.strokeStyle = '#8B0000'; // Darker red border
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        // Process one direction from the queue per move
        if (directionQueue.length > 0) {
            direction = directionQueue.shift();
        }

        const head = { x: snake[0].x, y: snake[0].y };

        switch (direction) {
            case 'up': head.y -= 1; break;
            case 'down': head.y += 1; break;
            case 'left': head.x -= 1; break;
            case 'right': head.x += 1; break;
        }

        snake.unshift(head);

        if (didGameEnd()) {
            gameOver = true;
            return;
        }

        const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
        if (hasEatenFood) {
            score += 10;
            if (scoreElement) scoreElement.textContent = score;
            createFood(); // Always create new food when eaten

            // Check for level up condition
            if (score > 0 && score % 100 === 0) {
                console.log('Level up triggered! Score:', score);
                isLevelingUp = true;
                startLevelUpSequence();
                return; // Exit early to prevent normal game loop continuation
            }
        } else {
            snake.pop();
        }
    }

    function createFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Ensure food is not created on the snake
        for (const part of snake) {
            if (part.x === food.x && part.y === food.y) {
                createFood(); // Recursively call to find a new spot
                return;
            }
        }
    }

    function changeDirection(event) {
        const keyPressed = event.key.toLowerCase();

        // Check if it's a directional key
        const isDirectionalKey = (keyPressed === 'arrowup' || keyPressed === 'w') ||
                                (keyPressed === 'arrowdown' || keyPressed === 's') ||
                                (keyPressed === 'arrowleft' || keyPressed === 'a') ||
                                (keyPressed === 'arrowright' || keyPressed === 'd');

        // Start the game if it hasn't started and a directional key is pressed
        if (!gameStarted && isDirectionalKey) {
            gameStarted = true;
            main(); // Start the game loop
            // Don't return here, let the direction change be processed
        }

        // Toggle pause state with 'p'
        if (keyPressed === 'p') {
            togglePause();
            return;
        }

        // Ignore other keys if paused, game over, leveling up, or game not started
        if (isPaused || gameOver || isLevelingUp || !gameStarted) {
            return;
        }

        // The direction the snake will be going in the next frame, considering the queue.
        const lastQueuedDirection = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;

        // Prevent adding the opposite direction to the queue
        if ((keyPressed === 'arrowup' || keyPressed === 'w') && lastQueuedDirection !== 'down') {
            directionQueue.push('up');
        }
        if ((keyPressed === 'arrowdown' || keyPressed === 's') && lastQueuedDirection !== 'up') {
            directionQueue.push('down');
        }
        if ((keyPressed === 'arrowleft' || keyPressed === 'a') && lastQueuedDirection !== 'right') {
            directionQueue.push('left');
        }
        if ((keyPressed === 'arrowright' || keyPressed === 'd') && lastQueuedDirection !== 'left') {
            directionQueue.push('right');
        }
    }

    function didGameEnd() {
        // Check for collision with self
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }

        // Check for collision with walls
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= tileCount;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= tileCount;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function restartGame() {
        clearTimeout(gameLoopTimeout);

        snake = [{ x: 10, y: 10 }];
        score = 0;
        level = 1;
        direction = 'right';
        gameOver = false;
        isLevelingUp = false;
        isPaused = false;
        gameStarted = false; // Reset to show start screen
        directionQueue = [];
        gameSpeed = 100;
        if (levelElement) levelElement.textContent = level;
        if (scoreElement) scoreElement.textContent = score;
        if (restartButton) restartButton.style.display = 'none';
        createFood();
        main(); // This will show the start screen
    }

    // Add a small delay to ensure all elements are fully loaded
    setTimeout(() => {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        scoreElement = document.getElementById('score');
        
        // Language selector elements
        flagBR = document.getElementById('flag-br');
        flagUS = document.getElementById('flag-us');
        
        // More robust way to find the level element
        levelElement = document.getElementById('level');
        if (!levelElement) {
            levelElement = document.querySelector('#level');
        }
        if (!levelElement) {
            levelElement = document.querySelector('span[id="level"]');
        }
        if (!levelElement) {
            // Last resort: find by content
            const spans = document.querySelectorAll('span');
            for (let span of spans) {
                if (span.textContent.trim() === '1' && span.parentElement && span.parentElement.textContent.includes('Level:')) {
                    levelElement = span;
                    console.log('Found level element by content matching');
                    break;
                }
            }
        }
        
        restartButton = document.getElementById('restartButton');

        gridSize = 20;
        tileCount = canvas.width / gridSize;

        // Debug: Check if elements are found
        console.log('Elements found:');
        console.log('canvas:', canvas);
        console.log('scoreElement:', scoreElement);
        console.log('levelElement:', levelElement);
        console.log('restartButton:', restartButton);

        if (!canvas || !scoreElement || !restartButton) {
            console.error('Critical elements not found!');
            return;
        }
        
        if (!levelElement) {
            console.warn('Level element not found, creating a replacement...');
            // Create the level element if it doesn't exist
            const gameInfo = document.querySelector('.game-info');
            if (gameInfo) {
                const infoBox = document.createElement('div');
                infoBox.className = 'info-box';
                infoBox.innerHTML = 'Level: <span id="level-new">1</span>';
                gameInfo.insertBefore(infoBox, restartButton);
                levelElement = document.getElementById('level-new');
                console.log('Created new level element:', levelElement);
            }
        }

        // Setup event listeners
        document.addEventListener('keydown', changeDirection);
        if (restartButton) restartButton.addEventListener('click', restartGame);
        
        // Language selector event listeners
        if (flagBR) flagBR.addEventListener('click', () => updateLanguage('pt-BR'));
        if (flagUS) flagUS.addEventListener('click', () => updateLanguage('en-US'));

        // Initialize language (default Portuguese)
        updateLanguage('pt-BR');

        // Initialize the game (show start screen)
        createFood();
        main(); // This will show the start screen since gameStarted is false
        
    }, 100); // End of setTimeout
});
