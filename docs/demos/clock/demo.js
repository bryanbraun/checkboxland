import { Checkboxland } from '../../../src/index.js';
import { fourByEleven } from './font-4x11.js';

let cbl;
let intervalId;
const dimensions = '44x15';

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });
  updateClock();
  intervalId = setInterval(updateClock, 1000);
  return cbl;
}

function cleanUp() {
  clearInterval(intervalId);
}

function getCurrentTimeString() {
  const date = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  const timeString = date.toLocaleString('en-US', options);
  const abbreviatedTimeString = timeString.split(' ')[0];
  return abbreviatedTimeString;
}

function updateClock() {
  cbl.print(getCurrentTimeString(), { font: fourByEleven, x: 3, y: 2, fillValue: 0 });
}

export {
  init,
  cleanUp,
  dimensions,
}
