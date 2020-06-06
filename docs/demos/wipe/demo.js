import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const dimensions = `${width}x${height}`;

let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  let firstMatrix = cbl.print(`Hello`, { dataOnly: true, x: 2, y: 2, fillValue: 0 });
  let invertedFirstMatrix = cbl.dataUtils('invert', firstMatrix);
  let secondMatrix = cbl.print(`World`, { dataOnly: true, x: 10, y: 6, fillValue: 0 });

  function transition1() {
    cbl.transitionWipe(invertedFirstMatrix, { interval: 120, callback: transition2 });
  }

  function transition2() {
    cbl.transitionWipe(secondMatrix, { interval: 120, callback: transition1 });
  }

  // Kick off the cycle
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
