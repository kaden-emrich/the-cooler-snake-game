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

function moveSnake() {
    if(!testValidMove(snake[0], snakeDirection)) {
        console.log('Invalid move!'); // for debugging
        return;
    }

    let nextSquare = snake[0] + snakeDirection;
    squares[snake[0]].classList.remove('snake-head');
    snake.unshift(nextSquare);
    while(snake.length > snakeLength) {
        squares[snake.pop()].classList.remove('snake', 'snake-head', 'snake-top', 'snake-bottom', 'snake-right', 'snake-left');
    }
    updateSnake();
}

function updateSnake() {
    for(let s = snake.length - 1; s >= 0; s--) {
        squares[snake[s]].classList = ['snake'];
        // squares[snake[s]].classList.add('snake-body-top', 'snake-body-bottom', 'snake-body-right', 'snake-body-left');
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
}

function init() {
    initGrid();
    initSnake();
    updateSnake();
}

document.addEventListener('keydown', (event) => {
    //console.log(event.key); // for debugging
    switch(event.key) {
        case 'ArrowUp':
            snakeDirection = 0 - numColumns;
            moveSnake();
            break;
        case 'ArrowDown':
            snakeDirection = numColumns;
            moveSnake();
            break;
        case 'ArrowLeft':
            snakeDirection = 0 - 1;
            moveSnake();
            break;
        case 'ArrowRight':
            snakeDirection = 1;
            moveSnake();
            break;
        case ' ':
            snakeLength++;
            moveSnake();
            break;
    }
});

init();