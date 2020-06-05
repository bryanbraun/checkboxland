// Code originally written by Nate Jacobs
// (https://twitter.com/nathanAlan - https://nj.codes)

'use strict';

const _Rand = Math.random;
const _Round = Math.round;

const mappable = len => {
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(0);
  }
  return arr;
};

const populate = acc => acc.concat(_Round(_Rand()));

const liveOrDie = (row, cell, state) => {

  const grab = (arr, i, j) => {
    if (!arr[i]) return 0;
    return arr[i][j] || 0;
  };

  let thisCellIsAlive = state[row][cell];

  let neighbors = [
  grab(state, row - 1, cell - 1),
  grab(state, row - 1, cell),
  grab(state, row - 1, cell + 1),

  grab(state, row, cell - 1),
  grab(state, row, cell + 1),

  grab(state, row + 1, cell - 1),
  grab(state, row + 1, cell),
  grab(state, row + 1, cell + 1)];


  let liveNeighbors = neighbors.reduce((total, cell) => {
    return total + parseInt(cell);
  }, 0);

  if (thisCellIsAlive) {
    return liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
  } else {
    return liveNeighbors === 3 ? 1 : 0;
  }
};


export const life = {
  state: [],

  seed(cols, rows) {
    this.state = mappable(rows).map(row => {
      return mappable(cols).reduce(populate, []);
    });
  },

  generate() {
    return this.state = this.state.map((row, y) => {
      return row.map((cell, x) => {
        return liveOrDie(y, x, this.state);
      });
    });
  }
};
