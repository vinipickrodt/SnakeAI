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
    let keysPressed = {}; // Track which keys are currently pressed

    // Lives system variables
    let lives = 3;
    let isBlinking = false;
    let blinkStartTime = 0;
    let lifePowerUp = null;
    let lifePowerUpTimer = 0;
    let foodsEaten = 0;

    // Canvas and context variables (declare in global scope)
    let canvas, ctx, scoreElement, levelElement, restartButton, flagBR, flagUS, livesElement;
    let gridSize, tileCount;

    // Language persistence functions
    function saveLanguagePreference(lang) {
        try {
            localStorage.setItem('snakeGameLanguage', lang);
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }

    function getSavedLanguage() {
        try {
            return localStorage.getItem('snakeGameLanguage');
        } catch (error) {
            console.warn('Could not retrieve language preference:', error);
            return null;
        }
    }

    // Language system
    let currentLanguage = getSavedLanguage() || 'pt-BR';
    
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

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];
        
        // Update HTML elements
        document.getElementById('game-title').textContent = t.gameTitle;
        document.getElementById('score-label').textContent = t.scoreLabel;
        document.getElementById('level-label').textContent = t.levelLabel;
        if (document.getElementById('lives-label')) document.getElementById('lives-label').textContent = t.livesLabel;
        if (restartButton) restartButton.textContent = t.restartButton;
        document.title = t.gameTitle;
        document.documentElement.lang = lang;
        
        // Update flag states
        if (flagBR) flagBR.classList.toggle('active', lang === 'pt-BR');
        if (flagUS) flagUS.classList.toggle('active', lang === 'en-US');
        
        // Redraw current screen if game is not running
        if (!gameStarted || gameOver || isPaused) {
            clearCanvas()
            if (canvas && ctx) main();
        }

        // Save the new language preference
        saveLanguagePreference(lang);
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
            drawLifePowerUp();
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
        drawLifePowerUp();
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
            drawLifePowerUp();
            drawSnake();

            // Draw overlay and text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }

        // Animate typing effect for the level text
        function animateTyping(fullText, callback) {
            let currentText = '';
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < fullText.length) {
                    currentText += fullText[charIndex];
                    charIndex++;
                    drawLevelUpScreen(currentText);
                    setTimeout(typeChar, 150); // 150ms delay between characters
                } else {
                    // Typing animation complete, wait a bit then call callback
                    setTimeout(callback, 1000);
                }
            }
            
            typeChar();
        }

        // Start typing animation for the level text
        const levelText = `${getText('level')} ${level}`;
        animateTyping(levelText, () => {
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
        });
    }

    function clearCanvas() {
        ctx.fillStyle = '#a8d5e5'; // A light blue background from CSS
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        // Handle blinking effect
        if (isBlinking) {
            const blinkDuration = 2000; // 2 seconds
            const blinkInterval = 200; // 200ms intervals
            const elapsed = Date.now() - blinkStartTime;
            
            if (elapsed >= blinkDuration) {
                isBlinking = false;
            } else {
                // Skip drawing every other interval to create blink effect
                const shouldShow = Math.floor(elapsed / blinkInterval) % 2 === 0;
                if (!shouldShow) return;
            }
        }
        
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

    function drawLifePowerUp() {
        if (!lifePowerUp) return;
        
        // Check if power-up should disappear (3 seconds)
        const elapsed = Date.now() - lifePowerUpTimer;
        if (elapsed >= 3000) {
            lifePowerUp = null;
            lifePowerUpTimer = 0;
            return;
        }
        
        // Draw pulsing heart-like power-up
        const pulseIntensity = Math.sin(elapsed / 100) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 20, 147, ${pulseIntensity})`; // Pink with pulsing alpha
        ctx.strokeStyle = '#8B0040'; // Dark pink border
        
        // Draw a cross/plus shape for life
        const x = lifePowerUp.x * gridSize;
        const y = lifePowerUp.y * gridSize;
        const size = gridSize;
        const crossWidth = size * 0.2;
        
        // Vertical bar
        ctx.fillRect(x + size * 0.4, y, crossWidth, size);
        ctx.strokeRect(x + size * 0.4, y, crossWidth, size);
        
        // Horizontal bar
        ctx.fillRect(x, y + size * 0.4, size, crossWidth);
        ctx.strokeRect(x, y + size * 0.4, size, crossWidth);
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

        // Check for wall collision and handle teleporting
        let hitWall = false;
        if (head.x < 0) {
            head.x = tileCount - 1;
            hitWall = true;
        } else if (head.x >= tileCount) {
            head.x = 0;
            hitWall = true;
        } else if (head.y < 0) {
            head.y = tileCount - 1;
            hitWall = true;
        } else if (head.y >= tileCount) {
            head.y = 0;
            hitWall = true;
        }

        snake.unshift(head);

        // Check for self collision
        let hitSelf = false;
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                hitSelf = true;
                break;
            }
        }

        // Handle collisions that cost lives
        if ((hitWall || hitSelf) && !isBlinking) {
            loseLife();
            if (gameOver) return;
        }

        // Check for food consumption
        const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
        if (hasEatenFood) {
            score += 1;
            foodsEaten++;
            if (scoreElement) scoreElement.textContent = score;
            createFood();

            // Check if life power-up should appear
            if (foodsEaten % 5 === 0) {
                createLifePowerUp();
            }

            // Check for level up condition (every 10 points now)
            if (score > 0 && score % 10 === 0) {
                console.log('Level up triggered! Score:', score);
                isLevelingUp = true;
                startLevelUpSequence();
                return;
            }
        } else {
            snake.pop();
        }

        // Check for life power-up consumption
        if (lifePowerUp && snake[0].x === lifePowerUp.x && snake[0].y === lifePowerUp.y) {
            lives++;
            if (livesElement) livesElement.textContent = lives;
            lifePowerUp = null;
            lifePowerUpTimer = 0;
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

    function createLifePowerUp() {
        lifePowerUp = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        // Ensure life power-up is not created on the snake or regular food
        for (const part of snake) {
            if (part.x === lifePowerUp.x && part.y === lifePowerUp.y) {
                createLifePowerUp();
                return;
            }
        }
        if (lifePowerUp.x === food.x && lifePowerUp.y === food.y) {
            createLifePowerUp();
            return;
        }

        lifePowerUpTimer = Date.now();
    }

    function loseLife() {
        lives--;
        if (livesElement) livesElement.textContent = lives;
        
        if (lives <= 0) {
            gameOver = true;
            return;
        }

        // Start blinking effect
        isBlinking = true;
        blinkStartTime = Date.now();
    }

    function didGameEnd() {
        // Game only ends when lives reach 0
        return lives <= 0;
    }

    function changeDirection(event) {
        const keyPressed = event.key.toLowerCase();

        // Prevent processing if key is already pressed (avoid repeat events)
        if (keysPressed[keyPressed]) {
            return;
        }
        keysPressed[keyPressed] = true;

        // Check if it's a directional key
        const isDirectionalKey = (keyPressed === 'arrowup' || keyPressed === 'w') ||
                                (keyPressed === 'arrowdown' || keyPressed === 's') ||
                                (keyPressed === 'arrowleft' || keyPressed === 'a') ||
                                (keyPressed === 'arrowright' || keyPressed === 'd');

        // Start the game if it hasn't started yet and a directional key is pressed
        if (!gameStarted && isDirectionalKey) {
            gameStarted = true;
            console.log('Game started!');
            main(); // Start the main game loop
        }

        // Handle pause
        if (keyPressed === 'p' && gameStarted) {
            togglePause();
            return;
        }

        // Prevent direction changes during pause, level up, or game over
        if (isPaused || isLevelingUp || gameOver || !gameStarted) {
            return;
        }

        // Prevent reverse direction (can't go directly backwards)
        const oppositeDirections = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        let newDirection = null;

        // Map keys to directions
        if (keyPressed === 'arrowup' || keyPressed === 'w') {
            newDirection = 'up';
        } else if (keyPressed === 'arrowdown' || keyPressed === 's') {
            newDirection = 'down';
        } else if (keyPressed === 'arrowleft' || keyPressed === 'a') {
            newDirection = 'left';
        } else if (keyPressed === 'arrowright' || keyPressed === 'd') {
            newDirection = 'right';
        }

        // Only add to queue if it's a valid direction and not opposite to current direction
        if (newDirection && newDirection !== oppositeDirections[direction]) {
            // Limit queue size to prevent spam
            if (directionQueue.length < 3) {
                directionQueue.push(newDirection);
            }
        }
    }

    function handleKeyUp(event) {
        const keyPressed = event.key.toLowerCase();
        keysPressed[keyPressed] = false;
    }

    // ...existing code...
    function restartGame() {
        clearTimeout(gameLoopTimeout);

        snake = [{ x: 10, y: 10 }];
        score = 0;
        level = 1;
        lives = 3;
        direction = 'right';
        gameOver = false;
        isLevelingUp = false;
        isPaused = false;
        gameStarted = false; // Reset to show start screen
        directionQueue = [];
        keysPressed = {}; // Reset key states
        gameSpeed = 100;
        isBlinking = false;
        blinkStartTime = 0;
        lifePowerUp = null;
        lifePowerUpTimer = 0;
        foodsEaten = 0;
        
        if (levelElement) levelElement.textContent = level;
        if (scoreElement) scoreElement.textContent = score;
        if (livesElement) livesElement.textContent = lives;
        if (restartButton) restartButton.style.display = 'none';
        createFood();
        main(); // This will show the start screen
    }

    // Add a small delay to ensure all elements are fully loaded
    setTimeout(() => {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        scoreElement = document.getElementById('score');
        livesElement = document.getElementById('lives');
        
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

        // Create lives element if it doesn't exist
        if (!livesElement) {
            console.warn('Lives element not found, creating it...');
            const gameInfo = document.querySelector('.game-info');
            if (gameInfo) {
                const livesBox = document.createElement('div');
                livesBox.className = 'info-box';
                livesBox.innerHTML = '<span id="lives-label">Lives:</span> <span id="lives">3</span>';
                gameInfo.insertBefore(livesBox, restartButton);
                livesElement = document.getElementById('lives');
                console.log('Created lives element:', livesElement);
            }
        }

        // Setup event listeners
        document.addEventListener('keydown', changeDirection);
        document.addEventListener('keyup', handleKeyUp);
        if (restartButton) restartButton.addEventListener('click', restartGame);
        
        // Language selector event listeners
        if (flagBR) flagBR.addEventListener('click', () => updateLanguage('pt-BR'));
        if (flagUS) flagUS.addEventListener('click', () => updateLanguage('en-US'));

        // Initialize language (use saved preference or default to Portuguese)
        updateLanguage(currentLanguage);

        // Initialize the game (show start screen)
        createFood();
        main(); // This will show the start screen since gameStarted is false
        
    }, 100); // End of setTimeout
});
