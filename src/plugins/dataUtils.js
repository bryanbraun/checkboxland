/**
 * @typedef {Object} Options
 * @property {number} [all]
 * @property {number} [top]
 * @property {number} [right]
 * @property {number} [bottom]
 * @property {number} [left]
 */

/**
 * @param {'invert' | 'pad'} actionName 
 * @param {number[][]} matrix 
 * @param {Options} options 
 * @returns 
 */
function dataUtils(actionName, matrix, options) {
  const actions = {
    invert,
    pad,
  }

  return actions[actionName](matrix, options);
}

/**
 * 
 * @param {number[][]} matrix 
 * @returns 
 */
function invert(matrix) {
  return matrix.map((row) => {
    return row.map((value) => {
      return value ? 0 : 1;
    });
  });
}

/**
 * 
 * @param {number[][]} matrix 
 * @param {Options} options 
 * @returns 
 */
function pad(matrix, options = {}) {
  const isPaddingAllSidesEqually = Number.isInteger(options.all);

  const topPadding = isPaddingAllSidesEqually ? options.all : options.top;
  const rightPadding = isPaddingAllSidesEqually ? options.all : options.right;
  const bottomPadding = isPaddingAllSidesEqually ? options.all : options.bottom;
  const leftPadding = isPaddingAllSidesEqually ? options.all : options.left;

  // Create a new matrix with left and right padding.
  let newMatrix = matrix.map((row) => {
    let newRow = row;

    if (leftPadding) {
      newRow = [...Array(leftPadding).fill(0), ...newRow];
    }
    if (rightPadding) {
      newRow = [...newRow, ...Array(rightPadding).fill(0)];
    }

    return newRow;
  });

  // Set up to add top and bottom padding.
  const newRowLength = newMatrix[0].length;
  const buildPaddingRows = (/** @type {number} */ numberOfRows, /** @type {number} */ rowLength) => {
    const paddingRows = [];
    for (let i = 0; i < numberOfRows; i++) {
      paddingRows.push(Array(rowLength).fill(0));
    }
    return paddingRows;
  }

  if (topPadding) {
    newMatrix = [...buildPaddingRows(topPadding, newRowLength), ...newMatrix];
  }
  if (bottomPadding) {
    newMatrix = [...newMatrix, ...buildPaddingRows(bottomPadding, newRowLength)];
  }

  return newMatrix
}

/**
 * @type {import('../checkboxland.js').Plugin}
 */
export default {
  name: 'dataUtils',
  exec: dataUtils
}
