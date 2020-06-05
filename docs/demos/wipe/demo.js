import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const dimensions = `${width}x${height}`;

let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  let initialMatrix = getEmptyMatrix(1, width, height);
  let secondMatrix = cbl.print(`Hello`, { dataOnly: true });
  let paddedSecondMatrix = cbl.dataUtils('pad', secondMatrix, { top: 2, left: 2 });

  let finalMatrix = cbl.print(`World`, { dataOnly: true });
  let paddedFinalMatrix = cbl.dataUtils('pad', finalMatrix, { top: 6, left: 10 });
  let invertedPaddedFinalMatrix = cbl.dataUtils('invert', paddedFinalMatrix);

  function transition1() {
    cbl.transitionWipe(paddedSecondMatrix, { fillValue: 0, interval: 120, callback: transition2 });
  }

  function transition2() {
    cbl.transitionWipe(invertedPaddedFinalMatrix, { fillValue: 1, interval: 120, callback: transition1 });
  }

  // Kick off the cycle
  cbl.setData(initialMatrix);

  transition1();

  return cbl;
}

function getEmptyMatrix(fillValue = 0, width, height) {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    matrix[i] = [];
    for (let j = 0; j < width; j++) {
      matrix[i][j] = fillValue;
    }
  }

  return matrix;
}

function cleanUp() {
  cbl.transitionWipe.cleanUp();
}

export {
  init,
  cleanUp,
  dimensions,
}
