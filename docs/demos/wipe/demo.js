import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const dimensions = `${width}x${height}`;

let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  let initialMatrix = cbl.getEmptyMatrix({ fillValue: 1 });
  let secondMatrix = cbl.print(`Hello`, { dataOnly: true, x: 2, y: 2, fillValue: 0 });
  let finalMatrix = cbl.print(`World`, { dataOnly: true, x: 10, y: 6, fillValue: 0 });
  let invertedFinalMatrix = cbl.dataUtils('invert', finalMatrix);

  function transition1() {
    cbl.transitionWipe(secondMatrix, { interval: 120, callback: transition2 });
  }

  function transition2() {
    cbl.transitionWipe(invertedFinalMatrix, { interval: 120, callback: transition1 });
  }

  // Kick off the cycle
  cbl.setData(initialMatrix);

  transition1();

  return cbl;
}

function cleanUp() {
  cbl.transitionWipe.cleanUp();
}

export {
  init,
  cleanUp,
  dimensions,
}
