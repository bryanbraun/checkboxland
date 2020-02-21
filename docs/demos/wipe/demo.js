import { Checkboxland } from '../../../src/index.js';

const cbl = new Checkboxland({ dimensions: '44x15' });

const initialMatrix = cbl.dataUtils('invert', cbl.getData());

const secondMatrix = cbl.print(`Recurse`, { dataOnly: true });
const paddedSecondMatrix = cbl.dataUtils('pad', secondMatrix, { top: 2, left: 2 });

const finalMatrix = cbl.print(`Center`, { dataOnly: true });
const paddedFinalMatrix = cbl.dataUtils('pad', finalMatrix, { top: 6, left: 4 });
const invertedPaddedFinalMatrix = cbl.dataUtils('invert', paddedFinalMatrix);

function transition1() {
  cbl.transitionWipe(paddedSecondMatrix, { fillValue: 0, interval: 120, callback: transition2 });
}

function transition2() {
  cbl.transitionWipe(invertedPaddedFinalMatrix, { fillValue: 1, interval: 120, callback: transition1 });
}

// Kick off the cycle
cbl.setData(initialMatrix);

transition1();

// For easy debugging
window.cbl = cbl;
