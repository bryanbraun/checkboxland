import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const dimensions = `${width}x${height}`;
const frames = []

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

function getPinwheelCheckbox(x, y, t) {
  let bladeConstant = 8; // should be an even-numbered integer
  let scaleConstant = 30;
  let scaledTime = t * 6;

  // For reference, see https://www.desmos.com/calculator/sqtr7zw9uq
  return y < scaleConstant * Math.sin(bladeConstant * Math.atan(y/x) + scaledTime);
}

// Shift the origin of the coordinate plane to the center of the grid
// instead of the top left. Assumes y is an odd number.
function shiftCoordinates(x, y) {
  const newX = (width - x) - (width / 2);
  const newY = (height - 1 - y) - ((height - 1) / 2);
  return [newX, newY];
}

function loop() {
  let checkboxState;
  let newMatrix = [];

  elapsedTimeSeconds = (performance.now() - startTime) / 1000;

  for (let y = 0; y < height; y++) {
    newMatrix[y] = [];
    for (let x = 0; x < width; x++) {
      let [reIndexedX, reIndexedY] = shiftCoordinates(x, y);

      checkboxState = getPinwheelCheckbox(reIndexedX, reIndexedY, elapsedTimeSeconds);
      newMatrix[y][x] = checkboxState ? 1 : 0;
    }
  }

  cbl.setData(newMatrix);

  timeoutId = setTimeout(loop, interval);
}

function cleanUp() {
  clearInterval(timeoutId);
}

export {
  init,
  cleanUp,
  dimensions,
}
