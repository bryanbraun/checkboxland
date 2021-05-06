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

function simpleWave(x, y, t) {
  let frequencyConstant = 0.9;
  let scaledTime = t * 3;

  // For reference, see https://www.desmos.com/calculator/bp9t79pfa0
  return y < 5 * Math.sin((x - scaledTime) / frequencyConstant);
}

function hypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
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

      let radialX = hypotenuseLength(reIndexedX, reIndexedY);

      checkboxState = simpleWave(radialX, 0, elapsedTimeSeconds);
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
