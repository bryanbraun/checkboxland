import { Checkboxland } from '../../../src/index.js';

const selector = '#checkboxland';
const dimensions = '16x16';
const fillValue = 0;

const cbl = new Checkboxland({ selector, dimensions, fillValue });

// for console scratchpad things
window.Checkboxland = Checkboxland;
window.cbl = cbl;
