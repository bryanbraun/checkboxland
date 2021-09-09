import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const dimensions = `${width}x${height}`;

let interval = 100;
let cbl;
let timeoutId;
let startTime;
let elapsedTimeSeconds;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });
  startTime = performance.now();

  loop();

  return cbl;
}

function getCheckerboardCheckbox(x, y, t) {
  let xOffset = 2*t;
  let yOffset = -1.6*t;
  let sizeValue = 1;

  // For reference, see https://www.desmos.com/calculator/l0nb1db6te
  return Math.cos(x - xOffset) + Math.cos(y - yOffset) + sizeValue > 1;
}

function loop() {
  let checkboxState;
  let newMatrix = [];

  elapsedTimeSeconds = (performance.now() - startTime) / 1000;

  for (let y = 0; y < height; y++) {
    newMatrix[y] = [];
    for (let x = 0; x < width; x++) {
      checkboxState = getCheckerboardCheckbox(x, y, elapsedTimeSeconds);
      newMatrix[y][x] = checkboxState ? 1 : 0;
    }
  }

  cbl.setData(newMatrix);

  timeoutId = setTimeout(loop, interval);
}

function cleanUp() {
  clearTimeout(timeoutId);
}

export {
  init,
  cleanUp,
  dimensions,
}
