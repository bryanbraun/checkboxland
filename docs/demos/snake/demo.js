import { Checkboxland } from '../../../src/index.js';

// Game config
let cbl;
const width = 44;
const height = 15;
const interval = 150;
const dimensions = `${width}x${height}`;
const directionMap = {
  '37': 'left',
  '39': 'right',
  '38': 'up',
  '40': 'down'
};

// Elements
const bodyEl = document.querySelector('body');

// Game state
let lastUserDirectionCommand;
let snakeVector;
let snake;
let apple;
let gameMap;
let intervalId;

// Game Loop
function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });
  document.querySelector('#checkboxland').focus();
  bodyEl.addEventListener('keydown', captureDirectionInput);

  setInitialState();
  intervalId = setInterval(advanceTheGame, interval);

  return cbl;
}

function cleanUp() {
  bodyEl.removeEventListener('keydown', captureDirectionInput);
  clearInterval(intervalId);
}

/// FUNCTIONS

function setInitialState() {
  lastUserDirectionCommand = '';
  snakeVector = 'right'; // possible: 'right' 'left' 'up' or 'down'
  snake = [{ x:14, y:7 }, { x:13, y:7 }, { x:12, y:7 }];
  apple = { x:24, y:7 };
  gameMap = cbl.getEmptyMatrix();
  intervalId;
}

function advanceTheGame() {
  let tailSegmentCopy = Object.assign({}, snake[snake.length - 1]);

  // Advance the Snake
  advanceTheSnake();

  // Check for Snake Collision
  if (isSnakeCollision()) {
    gameOver();
    return;
  }

  if (isSnakeEatingApple()) {
    snake.push(tailSegmentCopy);
    repositionApple();
  }

  redrawGameMap();
}

function advanceTheSnake() {
  // Move each snake segment to the location of the one in front of it,
  // starting at the tail until we reach the head.
  for (var i = snake.length - 1; i > 0; i--) {
    snake[i] = Object.assign({}, snake[i-1]);
  }

  // Move the head of the snake, based on the last user direction command.
  if (lastUserDirectionCommand === 'left' && snakeVector !== 'right') {
    snake[0].x--;
    snakeVector = 'left';
  } else
  if (lastUserDirectionCommand === 'right' && snakeVector !== 'left') {
    snake[0].x++;
    snakeVector = 'right';
  } else
  if (lastUserDirectionCommand === 'up' && snakeVector !== 'down') {
    snake[0].y--;
    snakeVector = 'up';
  } else
  if (lastUserDirectionCommand === 'down' && snakeVector !== 'up') {
    snake[0].y++;
    snakeVector = 'down';
  } else {
    // If the code reached here, a person tried to steer the snake in the
    // opposite direction of it's current trajectory. When this happens, we just
    // ignore the user's command and keep the snake moving along the current vector.
    switch (snakeVector) {
      case 'left':
        snake[0].x--
        break;
      case 'right':
        snake[0].x++
        break;
      case 'up':
        snake[0].y--
        break;
      case 'down':
        snake[0].y++
        break;
    }
  }
}

function repositionApple() {
  let newAppleX;
  let newAppleY;
  let isOverlappingSnake;

  // A loop to prevent our new apple position from overlapping the snake.
  do {
    if (newAppleX) {
      console.log('overlap prevented');
    }

    newAppleX = Math.floor(Math.random() * width);
    newAppleY = Math.floor(Math.random() * height);
    isOverlappingSnake = snake.some((currentSnakeSegment, index) => {
      return (currentSnakeSegment.x === newAppleX && currentSnakeSegment.y === newAppleY);
    });
  } while (isOverlappingSnake);

  apple.x = newAppleX;
  apple.y = newAppleY;
}

function isSnakeEatingApple() {
  return snake[0].x === apple.x && snake[0].y === apple.y;
}

function isSnakeCollision() {
  const isWallCollision = snake[0].x < 0 || snake[0].y < 0 || snake[0].x > width-1 || snake[0].y > height-1;
  const isSelfCollision = snake.some((currentSnakeSegment, index) => {
    if (index === 0) return;
    return snake[0].x === currentSnakeSegment.x && snake[0].y === currentSnakeSegment.y;
  });

  return isWallCollision || isSelfCollision;
}

function redrawGameMap() {
  // clear the existing map
  gameMap = cbl.getEmptyMatrix();

  // Draw the snake and apple on the map as-is.
  gameMap[apple.y][apple.x] = 2;

  snake.forEach(snakeSegment => {
    gameMap[snakeSegment.y][snakeSegment.x] = 1
  });

  cbl.setData(gameMap);
}

function gameOver() {
  clearInterval(intervalId);
  printGameOver();
}

function printGameOver() {
  var gameTxt = cbl.print('game', { dataOnly: true });
  var overTxt = cbl.print('over', { dataOnly: true });
  overTxt.shift();
  var combinedTxt = [...gameTxt, ...overTxt];
  var finalTxt = cbl.dataUtils('pad', combinedTxt, {left: 2, right: 1, bottom: 2});

  cbl.setData(finalTxt);
}

function captureDirectionInput(e) {
  const keycode = e.keyCode.toString();
  const validDirection = directionMap[keycode];

  if (validDirection) {
    e.preventDefault();
    lastUserDirectionCommand = validDirection;
  }
}

/// MODULE EXPORT

export {
  init,
  cleanUp,
  dimensions,
}

