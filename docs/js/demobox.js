import { Checkboxland } from '../../src/index.js';

import * as marqueeDemo from '../demos/marquee/demo.js';
import * as rippleDemo from '../demos/ripple/demo.js';
import * as snakeDemo from '../demos/snake/demo.js';
import * as pinwheelDemo from '../demos/pinwheel/demo.js';
import * as clockDemo from '../demos/clock/demo.js';
import * as webcamDemo from '../demos/webcam/demo.js';
import * as gameOfLifeDemo from '../demos/game-of-life/demo.js';
import * as lasersDemo from '../demos/lasers/demo.js';
import * as iconsDemo from '../demos/icons/demo.js';
import * as spiralDemo from '../demos/spiral/demo.js';
import * as checkerboardDemo from '../demos/checkerboard/demo.js';
import * as wipeDemo from '../demos/wipe/demo.js';
import * as imageDemo from '../demos/image/demo.js';
import * as qrCodeDemo from '../demos/qr-code/demo.js';
import * as waveDemo from '../demos/wave/demo.js';
import * as onClickDemo from '../demos/on-click/demo.js';

const demoNameMap = {
  marquee: marqueeDemo,
  ripple: rippleDemo,
  snake: snakeDemo,
  pinwheel: pinwheelDemo,
  clock: clockDemo,
  webcam: webcamDemo,
  gameOfLife: gameOfLifeDemo,
  lasers: lasersDemo,
  icons: iconsDemo,
  spiral: spiralDemo,
  checkerboard: checkerboardDemo,
  wipe: wipeDemo,
  image: imageDemo,
  qrCode: qrCodeDemo,
  wave: waveDemo,
  onClick: onClickDemo,
};

let cbl;
let currentDemo = {};

function buildDemo(demoName) {
  let nextDemo = demoNameMap[demoName];
  let nextDemoDimensions = nextDemo.dimensions.split('x').map(val => Number(val));
  let isDimensionsMatch = (cbl.dimensions[0] === nextDemoDimensions[0]) && (cbl.dimensions[1] === nextDemoDimensions[1]);

  if (currentDemo.cleanUp) {
    currentDemo.cleanUp();
  }

  if (isDimensionsMatch) {
    nextDemo.init(cbl);
  } else {
    cbl = nextDemo.init();
  }

  currentDemo = nextDemo;
}

function init() {
  cbl = new Checkboxland({ dimensions: '44x15' });
  buildDemo('wave');

  document.forms.demoboxForm.addEventListener('change', function handleDemoChange(e) {
    if (e.target.name === 'demoRadios') {
      buildDemo(e.target.value);
    }
  });
}

export const demobox = {
  init
};
