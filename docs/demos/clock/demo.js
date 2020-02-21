import { Checkboxland } from '../../../src/index.js';
import { fourByEleven } from './font-4x11.js';

const cbl = new Checkboxland({ dimensions: '35x15' });

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
  const clockData = cbl.print(getCurrentTimeString(), { font: fourByEleven, dataOnly: true });
  const paddedClockData = cbl.dataUtils('pad', clockData, { left: 1, top: 2 });
  cbl.setData(paddedClockData);
}

setInterval(updateClock, 1000);
