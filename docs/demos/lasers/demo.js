import { Checkboxland } from '../../../src/index.js';

// Config
let cbl;
const width = 44;
const height = 15;
const interval = 70;
const dimensions = `${width}x${height}`;
const maxLaserLength = 8;
const vectors = ['↗', '↘', '↙', '↖'];
const reflections = {
  'top': {
    '↗': '↘',
    '↖': '↙',
  },
  'left': {
    '↖': '↗',
    '↙': '↘',
  },
  'right': {
    '↘': '↙',
    '↗': '↖',
  },
  'bottom': {
    '↙': '↖',
    '↘': '↗',
  }
};

// State
let lasers;
let grid;
let intervalId;

// Init Loop
function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });
  cbl.onClick(({ x, y }) => lasers.push(new Laser({ x, y })));

  setInitialState();

  intervalId = setInterval(() => {
    lasers.forEach(laser => advanceTheLaser(laser));

    redrawGrid();
  }, interval);

  return cbl;
}

function cleanUp() {
  cbl.onClick.cleanUp();
  clearInterval(intervalId);
}

/// FUNCTIONS

function setInitialState() {
  lasers = [new Laser({ x:14, y:7 }, '↗')];
  grid = cbl.getEmptyMatrix();
  intervalId;
}

function advanceTheLaser(laser) {
  // If needed, update the vector of the laser
  const wallsCollidedWith = detectWallCollisions(laser);

  if (wallsCollidedWith.length !== 0) {
    wallsCollidedWith.forEach(wallCollidedWith => {
      // If we've just created a new laser on a boundary cell, this might not be true.
      if (laser.vector in reflections[wallCollidedWith]) {
        laser.vector = reflections[wallCollidedWith][laser.vector];
      }
    });
  }

  // Move the body of the laser
  if (laser.beam.length >= maxLaserLength) {
    // Move each laser segment to the location of the one in front of it,
    // starting at the tail until we reach the head.
    for (var i = laser.beam.length - 1; i > 0; i--) {
      laser.beam[i] = Object.assign({}, laser.beam[i - 1]);
    }
  } else {
    // Leave the body as-is and clone the head of the laser
    laser.beam.unshift({ x: laser.beam[0].x, y: laser.beam[0].y });
  }

  // Move the head of the laser, based on the current vector.
  if (laser.vector === '↗') {
    laser.beam[0].x++;
    laser.beam[0].y--;
  } else
  if (laser.vector === '↘') {
    laser.beam[0].x++;
    laser.beam[0].y++;
  } else
  if (laser.vector === '↙') {
    laser.beam[0].x--;
    laser.beam[0].y++;
  } else
  if (laser.vector === '↖') {
    laser.beam[0].x--;
    laser.beam[0].y--;
  }
}

function detectWallCollisions(laser) {
  const wallsCollidedWith = [];

  if (laser.beam[0].y === 0) {
    wallsCollidedWith.push('top');
  }
  if (laser.beam[0].x === 0) {
    wallsCollidedWith.push('left');
  }
  if (laser.beam[0].x === width - 1) {
    wallsCollidedWith.push('right');
  }
  if (laser.beam[0].y === height - 1) {
    wallsCollidedWith.push('bottom');
  }

  return wallsCollidedWith;
}

function redrawGrid() {
  // clear the existing map
  grid = cbl.getEmptyMatrix();

  // Draw the lasers on the map.
  lasers.forEach(laser => {
    laser.beam.forEach(laserSegment => {
      grid[laserSegment.y][laserSegment.x] = 1
    });
  });

  cbl.setData(grid);
}

class Laser {
  constructor({ x, y }, vector) {
    if (vector) {
      this.vector = vector;
    } else {
      this.vector = vectors[Math.floor(Math.random() * vectors.length)];
    }

    this.beam = [{ x, y }];
  }
}

export {
  init,
  cleanUp,
  dimensions,
}

