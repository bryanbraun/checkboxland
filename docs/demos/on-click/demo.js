import { Checkboxland } from '../../../src/index.js';

let dimensions = '44x15';
let cbl;
let lastPos = null;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  cbl.clearData();

  cbl.print('click', { x: 10, y: 0 });
  cbl.print('2 boxes', { x: 2, y: 8 });

  cbl.onClick(handleClick);

  return cbl;
}

function handleClick({ x, y, checkbox }) {
  if (!lastPos) {
    lastPos = { x, y };
    return;
  }
  draw(lastPos, { x, y });
  lastPos = null;
}

function draw(start, end) {
  const data = cbl.getData();

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      data[y][x] = 1;
    }
  }
  cbl.setData(data);
}

function cleanUp() {
  cbl.onClick.cleanUp();
}


export {
  init,
  cleanUp,
  dimensions,
}
