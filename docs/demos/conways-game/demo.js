import { Checkboxland } from '../../src/checkboxland.js';
import { life } from './conways.js';

const width = 35;
const height = 15;

const cbl = new Checkboxland({ dimensions: `${width}x${height}` });

life.seed(width, height);

cbl.setData(life.state);

let interval = 333;
let trueInterval = performance.now();

function loop() {
  setTimeout(function timeoutFunc() {
    if (document.getElementById('play').checked) {
      // Repopulate the board.
      life.generate();
      cbl.setData(life.state);
    }

    loop();
  }, interval);
}

loop();

// For easy debugging
window.cbl = cbl;
