import { Checkboxland } from '../../src/checkboxland.js';

const cbl = new Checkboxland({ dimensions: '18x8' });

cbl.setData([
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,1]
])

const textData = cbl.print('hi', { dataOnly: true });

cbl.marquee(textData, { repeat: true });

// For easy debugging
window.cbl = cbl;
