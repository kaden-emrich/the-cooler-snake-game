const MIN_SIZE = 10;

var urlParams = new URLSearchParams(window.location.search);

var gridDiv = document.getElementById('grid-div');
var menuLayer = document.getElementById('menus-div');
var titleText = document.getElementById('title-text');
var mainMenu = document.getElementById('main-menu');
var pauseMenu = document.getElementById('pause-menu');

var numColumns = numRows = 15;

var startSnakeLength = 2;

var squares = [];
var snake = [0];
var snakeLength = 2;
var snakeDirection = 1;

var growMultiplyer = 1;

var snakeSpeedMs = 300;
var snakeInterval;
var isPaused = true;
var isMainMenu = true;

var deathBuffer = 0;

function getScore() {
    return snakeLength - startSnakeLength;
}

function moveSnake() {
    if(!testValidMove(snake[0], snakeDirection)) {
        if(deathBuffer >= 1) {
            endGame();
        }
        else {
            deathBuffer++;
        }
        return;
    }

    deathBuffer = 0;

    let nextSquare = snake[0] + snakeDirection;

    if(squares[nextSquare].classList.contains('apple')) {
        squares[nextSquare].classList.remove('apple');
        snakeLength += growMultiplyer;
        randomApple();
    }

    squares[snake[0]].classList.remove('snake-head');
    snake.unshift(nextSquare);
    while(snake.length > snakeLength) {
        squares[snake.pop()].classList.remove('snake', 'snake-top', 'snake-bottom', 'snake-right', 'snake-left', 'snake-blob', 'snake-head');
    }
    
    let isApple = false;
    for(let i = 0; i < squares.length; i++) {
        if(squares[i].classList.contains('apple')) {
            isApple = true;
        }
    }
    if(!isApple) {
        randomApple();
    }

    updateSnake();
}

function updateSnake() {
    for(let s = snake.length - 1; s >= 0; s--) {
        squares[snake[s]].classList = ['snake'];
        var noBorderClass = false;

        if(s > 0) {
            if(snake[s - 1] == snake[s] + 1) {
                squares[snake[s]].classList.add('snake-right');
            }
            else if(snake[s - 1] == snake[s] - 1) {
                squares[snake[s]].classList.add('snake-left');
            }
            else if(snake[s - 1] == snake[s] + numColumns) {
                squares[snake[s]].classList.add('snake-bottom');
            }
            else if(snake[s - 1] == snake[s] - numColumns) {
                squares[snake[s]].classList.add('snake-top');
            }
            else {
                noBorderClass = true;
            }
        }
        else {
            noBorderClass = true;
        }
        if(s < snake.length) {
            if(snake[s + 1] == snake[s] + 1) {
                squares[snake[s]].classList.add('snake-right');
            }
            else if(snake[s + 1] == snake[s] - 1) {
                squares[snake[s]].classList.add('snake-left');
            }
            else if(snake[s + 1] == snake[s] + numColumns) {
                squares[snake[s]].classList.add('snake-bottom');
            }
            else if(snake[s + 1] == snake[s] - numColumns) {
                squares[snake[s]].classList.add('snake-top');
            }
            else {
                if(noBorderClass) {
                    squares[snake[s]].classList.add('snake-blob');
                }
            }
        }
    }
    squares[snake[0]].classList.add('snake-head');
}

function startSnake() {
    clearInterval(snakeInterval);
    snakeInterval = setInterval(() => {
        moveSnake();
    }, snakeSpeedMs);
}

function randomApple() {
    let appleIndex = -1;
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while(!createApple(appleIndex));

    //console.log(`spawned apple at ${appleIndex}`); // for debugging
}

function firstApple() {
    if(!createApple(snake[0] + 5)) {
        randomApple();
    }
}

function createApple(index) {
    let isApple = false;

    if(testValidPosition(index)) {
        squares[index].classList.add('apple');

        
        for(let i = 0; i < squares.length; i++) {
            if(squares[i].classList.contains('apple')) {
                isApple = true;
            }
        }
    }

    return isApple;
}

function testValidMove(currentPosition, direction) {
    let nextPosition = currentPosition + direction;
    if(!testValidPosition(nextPosition)) {
        return false;
    }

    if((currentPosition + 1) % numColumns == 0 && direction == 1) {
        return false;
    }
    if((nextPosition + 1) % numColumns == 0 && direction == -1) {
        return false;
    }

    return true;
}

function testValidPosition(position) {
    if(!squares[position]) {
        return false;
    }

    if(position < 0 || position >= squares.length) {
        return false;
    }

    if(squares[position].classList.contains('snake')) {
        return false;
    }

    return true;
}

function testEmptyPosition(position) {
    if(!testValidMove(position)) {
        return false;
    }
    if(squares[position].classList.contains('apple')) {
        return false;
    }

    return true;
}

function initGrid() {
    numColumns = numColumns < MIN_SIZE ? MIN_SIZE : numColumns;
    numRows = numRows < MIN_SIZE ? MIN_SIZE : numRows;

    for(let row = 0; row < numRows; row++) {
        for(let column = 0; column < numColumns; column++) {
            let nextSquare = document.createElement('div');
            nextSquare.style = `width: ${100 / numColumns}%; height: ${100 / numRows}%;`;

            gridDiv.appendChild(nextSquare);
            squares[squares.length] = nextSquare;
        }
    }
}

function initSnake() {
    let start = Math.floor((numRows / 2)) * numColumns + Math.floor(numColumns / 4);
    snake = [start];
    snakeLength = startSnakeLength;
    snakeDirection = 0;

    //startSnake();
}

function destroyGame() {
    gridDiv.innerHTML = '';
    squares = [];
    clearInterval(snakeInterval);
}

function newGame(width, height) {
    destroyGame();
    numColumns = width >= MIN_SIZE ? width : MIN_SIZE;
    numRows = height >= MIN_SIZE ? height : MIN_SIZE; 
    initGrid();
    isPaused = false;
    isMainMenu = false;
    menuLayer.style.display = 'none';

    initSnake();
    updateSnake();
    firstApple();
}

function getUrlItems() {
    if(parseInt(urlParams.get('game-size'))) {
        numColumns = numRows = parseInt(urlParams.get('game-size')) >= MIN_SIZE ? parseInt(urlParams.get('game-size')) : MIN_SIZE;
    }
}

function pause() {
    isPaused = true;
    clearInterval(snakeInterval);
    mainMenu.style.display = 'none';
    pauseMenu.style.display = 'flex';
    menuLayer.style.display = 'block';
}

function unpause() {
    if(snakeDirection != 0) {
        startSnake();
    }
    isPaused = false;
    mainMenu.style.display = 'none';
    pauseMenu.style.display = 'none';
    menuLayer.style.display = 'none';
}

function endGame() {
    clearInterval(snakeInterval);
    isPaused = true;
    titleText.innerText = `GAME OVER. Your score: ${getScore()}`;
    mainMenu.style.display = 'flex';
    menuLayer.style.display = 'block';
    isMainMenu = true;
}

function init() {
    getUrlItems();
    //newGame();
}

document.addEventListener('keydown', (event) => {
    //console.log(event.key); // for debugging
    let lastDirection = snakeDirection;

    if(isPaused && !(event.key == ' ' || event.key == 'Escape')) {
        return;
    }

    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            snakeDirection = 0 - numColumns;

            if(Math.abs(snakeDirection) != Math.abs(lastDirection)) {
                moveSnake();
                startSnake();
            } else {
                snakeDirection = lastDirection;
            }
            // moveSnake();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            snakeDirection = numColumns;

            if(Math.abs(snakeDirection) != Math.abs(lastDirection)) {
                moveSnake();
                startSnake();
            } else {
                snakeDirection = lastDirection;
            }
            // moveSnake();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            snakeDirection = 0 - 1;

            if(Math.abs(snakeDirection) != Math.abs(lastDirection)) {
                moveSnake();
                startSnake();
            } else {
                snakeDirection = lastDirection;
            }
            // moveSnake();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            snakeDirection = 1;

            if(Math.abs(snakeDirection) != Math.abs(lastDirection)) {
                moveSnake();
                startSnake();
            } else {
                snakeDirection = lastDirection;
            }
            // moveSnake();
            break;
        case ' ':
        case 'Escape':
            if(isMainMenu) break;
            if(isPaused) {
                unpause();
            }
            else {
                pause();
            }
    }
});
