const MIN_COLUMNS = 10;
const MIN_ROWS = 10;

var rootEl = document.querySelector(':root');
var gridDiv = document.getElementById('grid-div');

var numColumns = 10;
var numRows = 10;

var squares = [];
var snake = [2, 1, 0];
var snakeLength = 3;
var snakeDirection = 1;

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

function moveSnake() {
    let nextSpot = snake[0] + snakeDirection;
    squares[snake[0]].classList.remove('snake-head');
    snake.unshift(nextSpot);
    while(snake.length > snakeLength) {
        squares[snake.pop()].classList.remove('snake', 'snake-head', 'snake-body-top', 'snake-body-bottom', 'snake-body-right', 'snake-body-left');
    }
    updateSnake();
}

function updateSnake() {
    for(let s = 0; s < snake.length; s++) {
        squares[snake[s]].classList = ['snake'];
        squares[snake[s]].classList.add('snake-body-top', 'snake-body-bottom', 'snake-body-right', 'snake-body-left');

        if(s < snake.length) {
            if(snake[s + 1] == snake[s] + 1) {
                squares[snake[s]].classList.remove('snake-body-right');
            }
            else if(snake[s + 1] == snake[s] - 1) {
                squares[snake[s]].classList.remove('snake-body-left');
            }
            else if(snake[s + 1] == snake[s] + numColumns) {
                squares[snake[s]].classList.remove('snake-body-bottom');
            }
            else if(snake[s + 1] == snake[s] - numColumns) {
                squares[snake[s]].classList.remove('snake-body-top');
            }
        }
        if(s > 0) {
            if(snake[s - 1] == snake[s] + 1) {
                squares[snake[s]].classList.remove('snake-body-right');
            }
            else if(snake[s - 1] == snake[s] - 1) {
                squares[snake[s]].classList.remove('snake-body-left');
            }
            else if(snake[s - 1] == snake[s] + numColumns) {
                squares[snake[s]].classList.remove('snake-body-bottom');
            }
            else if(snake[s - 1] == snake[s] - numColumns) {
                squares[snake[s]].classList.remove('snake-body-top');
            }
        }
    }
    squares[snake[0]].classList.add('snake-head');
}

function init() {
    initGrid();
    updateSnake();
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            snakeDirection = 0 - numColumns;
            break;
        case 'ArrowDown':
            snakeDirection = numColumns;
            break;
        case 'ArrowLeft':
            snakeDirection = 0 - 1;
            break;
        case 'ArrowRight':
            snakeDirection = 1;
            break;
        case 'Space':
            snakeLength++;
            break;
    }
    moveSnake();
});

init();