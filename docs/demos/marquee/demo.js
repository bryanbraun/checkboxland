import { Checkboxland } from '../../src/checkboxland.js';

const cbl = new Checkboxland({ dimensions: '35x15' });

const textData = cbl.print('hi mom', { dataOnly: true });
const paddedTextData = cbl.dataUtils('pad', textData, { top: 4 });

cbl.marquee(paddedTextData, { interval: 150, repeat: true });

// For easy debugging
window.cbl = cbl;
