import { Checkboxland } from '../../lib/checkboxland.js'

function init() {
  const selector = '#logo';
  const logoEl = document.querySelector(selector);
  let currentState = 'checked';

  const cbl = new Checkboxland({ dimensions: '10x10', selector });

  cbl.setData(getMatrix(currentState));

  logoEl.addEventListener('click', (event) => {
    currentState = (currentState === 'checked') ? 'unchecked' : 'checked';
    cbl.setData(getMatrix(currentState));
  });
}

function getMatrix(state) {
  const states = {
    checked: [
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,0,0,1],
      [1,1,1,1,1,1,0,0,1,1],
      [1,0,1,1,1,0,0,1,1,1],
      [1,0,0,1,0,0,1,1,1,1],
      [1,1,0,0,0,1,1,1,1,1],
      [1,1,1,0,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,0],
    ],

    unchecked: [
      [0,1,1,1,1,1,1,1,1,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,1,1,1,1,1,1,1,1,0],
    ]
  }

  return states[state];
}

export const logo = {
  init
};


