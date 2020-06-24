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
  let frequencyConstant = 3;
  let scaledTime = t * 3;

  return y < 5 * Math.sin((x - scaledTime) / frequencyConstant);
}

function complexWave(x, y, t) {
  let frequencyConstant = 3;
  let scaledTime = t * 3;

  return y < 5 * Math.sin((x - scaledTime) / frequencyConstant) - (2 * Math.sin(2 * x - scaledTime));
}

function reIndexY(y) {
  // transform y to a more traditional scale (puts y=0 in the center
  // of the grid with positive values above and negative values below).
  return (height - 1 - y) - ((height - 1) / 2)
}

function loop() {
  let checkboxState;
  let newMatrix = [];

  elapsedTimeSeconds = (performance.now() - startTime) / 1000;

  for (let y = 0; y < height; y++) {
    newMatrix[y] = [];
    for (let x = 0; x < width; x++) {
      let reIndexedY = reIndexY(y);
      checkboxState = complexWave(x, reIndexedY, elapsedTimeSeconds);
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
