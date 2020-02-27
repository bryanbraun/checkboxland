import { Checkboxland } from '../../../src/index.js';

const cbl = new Checkboxland({ dimensions: '80x9' });
const cbl2 = new Checkboxland({ dimensions: '80x8', selector: '#checkboxland2' });

const textboxEl = document.querySelector('#textbox');
const textboxEl2 = document.querySelector('#textbox2');

cbl.print(textboxEl.value);
cbl2.print(textboxEl2.value);

textboxEl.addEventListener('input', (event) => {
  cbl.clearData();
  var data = cbl.print(event.target.value, { dataOnly: true });
  var paddedData = cbl.dataUtils('pad', data, {left: 12, top: 1});
  cbl.setData(paddedData);
});

textboxEl2.addEventListener('input', (event) => {
  cbl2.clearData();
  var data = cbl2.print(event.target.value, { dataOnly: true });
  var paddedData = cbl2.dataUtils('pad', data, {left: 6});
  cbl2.setData(paddedData);
});

// For easy debugging
window.cbl = cbl;
