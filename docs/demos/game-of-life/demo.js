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
  loop();

  return cbl;
}

function cleanUp() {
  clearTimeout(timeoutId);
}

function loop() {
  timeoutId = setTimeout(function timeoutFunc() {
    if (!playEl || (playEl && playEl.checked)) {
      // Repopulate the board.
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
