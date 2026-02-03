import { Checkboxland } from '../../../src/index.js';
import { life } from './game-of-life.js';

const width = 44;
const height = 15;
const interval = 200;
const playEl = document.getElementById('play');
const dimensions = `${width}x${height}`;
let timeoutId;
let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  life.seed(width, height);
  cbl.setData(life.state);
  cbl.onClick(({ x, y }) => cbl.setCheckboxValue(x, y, cbl.getCheckboxValue(x, y) ? 0 : 1));
  loop();

  return cbl;
}

function cleanUp() {
  clearTimeout(timeoutId);
  cbl.onClick.cleanUp();
}

function loop() {
  timeoutId = setTimeout(function timeoutFunc() {
    if (!playEl || (playEl && playEl.checked)) {
      // Repopulate the board.
      life.state = cbl.getData();
      life.generate();
      cbl.setData(life.state);
    }

    loop();
  }, interval);
}

export {
  init,
  cleanUp,
  dimensions
}
