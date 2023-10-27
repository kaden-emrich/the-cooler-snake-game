const MIN_COLUMNS = 10;
const MIN_ROWS = 10;

//var rootEl = document.querySelector(':root');
var gridDiv = document.getElementById('grid-div');

var numColumns = 15;
var numRows = 15;

var squares = [];
var snake = [0];
var snakeLength = 3;
var snakeDirection = 1;

var snakeSpeedMs = 300;
var snakeInterval;

function moveSnake() {
    if(!testValidMove(snake[0], snakeDirection)) {
        console.log('Invalid move!'); // for debugging
        clearInterval(snakeInterval);
        alert('You lose');
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
        squares[snake.pop()].classList.remove('snake', 'snake-top', 'snake-bottom', 'snake-right', 'snake-left');
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
    let appleIndex;
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while(!testValidPosition(appleIndex));

    squares[appleIndex].classList.add('apple');
    console.log(`spawned apple at ${appleIndex}`);
}

function createApple(index) {
    if(testValidPosition(index)) {
        squares[index].classList.add('apple');
    }
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
    if(position < 0 || position >= squares.length) {
        return false;
    }

    if(squares[position].classList.contains('snake')) {
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
    snakeLength = 2;

    startSnake();
}

function init() {
    initGrid();
    initSnake();
    updateSnake();
    randomApple();
}

document.addEventListener('keydown', (event) => {
    //console.log(event.key); // for debugging
    let lastDirection = snakeDirection;

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

init();