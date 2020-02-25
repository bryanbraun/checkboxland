import { Checkboxland } from '../../../src/index.js';

const cbl = new Checkboxland({ dimensions: '44x15' });

const textData = cbl.print("Don't Panic.", { dataOnly: true });
const paddedTextData = cbl.dataUtils('pad', textData, { top: 4 });

cbl.marquee(paddedTextData, { interval: 100, repeat: true });

// For easy debugging
window.cbl = cbl;
