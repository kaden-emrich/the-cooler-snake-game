const MIN_COLUMNS = 10;
const MIN_ROWS = 10;

//var rootEl = document.querySelector(':root');
var gridDiv = document.getElementById('grid-div');
var menuLayer = document.getElementById('menus-div');
var playButton = document.getElementById('play-button');
var titleText = document.getElementById('title-text');

var numColumns = 15;
var numRows = 15;

var startSnakeLength = 2;

var squares = [];
var snake = [0];
var snakeLength = 2;
var snakeDirection = 1;

var snakeSpeedMs = 300;
var snakeInterval;
var isPaused = true;

function getScore() {
    return snakeLength - startSnakeLength;
}

function moveSnake() {
    if(!testValidMove(snake[0], snakeDirection)) {
        //console.log('Invalid move!'); // for debugging
        clearInterval(snakeInterval);
        isPaused = true;
        titleText.innerText = `You lose. Your score: ${getScore()}`;
        menuLayer.style.display = 'block';
        return;
    }

    let nextSquare = snake[0] + snakeDirection;

    if(squares[nextSquare].classList.contains('apple')) {
        squares[nextSquare].classList.remove('apple');
        snakeLength++;
        randomApple();
    }

    squares[snake[0]].classList.remove('snake-head');
    snake.unshift(nextSquare);
    while(snake.length > snakeLength) {
        squares[snake.pop()].classList.remove('snake', 'snake-top', 'snake-bottom', 'snake-right', 'snake-left', 'snake-blob');
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
    if(testValidPosition(index)) {
        squares[index].classList.add('apple');
        return true;
    }
    return false;
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
    numColumns = numColumns < MIN_COLUMNS ? MIN_COLUMNS : numColumns;
    numRows = numRows < MIN_ROWS ? MIN_ROWS : numRows;

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
    snakeDirection = 1;

    startSnake();
}

function newGame() {
    for(let square of squares) {
        square.classList.remove('snake', 'snake-top', 'snake-bottom', 'snake-right', 'snake-left', 'apple', 'snake-blob');
    }
    isPaused = false;
    initSnake();
    updateSnake();
    firstApple();
}

function init() {
    initGrid();
    //newGame();
}

document.addEventListener('keydown', (event) => {
    //console.log(event.key); // for debugging
    let lastDirection = snakeDirection;
    if(isPaused) {
        return;
    }

    switch(event.key) {
        case 'ArrowUp':
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
            snakeDirection = 1;

            if(Math.abs(snakeDirection) != Math.abs(lastDirection)) {
                moveSnake();
                startSnake();
            } else {
                snakeDirection = lastDirection;
            }
            // moveSnake();
            break;
        // case ' ':
        //     snakeLength++;
        //     moveSnake();
        //     break;
    }
});

playButton.addEventListener('click', () => {
    newGame();
    menuLayer.style.display = 'none';
});

init();