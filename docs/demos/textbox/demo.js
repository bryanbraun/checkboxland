import { Checkboxland } from '../../../src/index.js';

const cbl = new Checkboxland({ dimensions: '80x9' });
const textboxEl = document.querySelector('#textbox');

cbl.print(textboxEl.value,  { x: 1, y: 1 });

textboxEl.addEventListener('input', (event) => {
  cbl.print(event.target.value, { x: 1, y: 1, fillValue: 0 });
});

