import { Checkboxland } from '../../../src/index.js';

const cbl = new Checkboxland({ dimensions: '35x15' });

const initialMatrix = cbl.print(`Don't`, { dataOnly: true });
const paddedInitialMatrix = cbl.dataUtils('pad', initialMatrix, { top: 2, left: 3 });

cbl.setData(paddedInitialMatrix);

const finalMatrix = cbl.print(`Panic`, { dataOnly: true });
const paddedFinalMatrix = cbl.dataUtils('pad', finalMatrix, { top: 6, left: 5 });
const invertedPaddedFinalMatrix = cbl.dataUtils('invert', paddedFinalMatrix);

function transition1() {
  cbl.transitionWipe(invertedPaddedFinalMatrix, { fillValue: 1, callback: transition2 });
}

function transition2() {
  cbl.transitionWipe(paddedInitialMatrix, { fillValue: 0, callback: transition1 });
}

// Kick off the cycle
transition1();

// For easy debugging
window.cbl = cbl;
