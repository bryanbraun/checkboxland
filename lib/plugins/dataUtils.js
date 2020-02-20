export function dataUtils(actionName, matrix, options) {
  const actions = {
    invert,
    pad,
  }

  return actions[actionName](matrix, options);
}

function invert(matrix) {
  return matrix.map((row) => {
    return row.map((value) => {
      return value ? 0 : 1;
    });
  });
}

function pad(matrix, options = 1) {
  const isPaddingAllSidesEqually = Number.isInteger(options);

  const topPadding = isPaddingAllSidesEqually ? options : options.top;
  const rightPadding = isPaddingAllSidesEqually ? options : options.right;
  const bottomPadding = isPaddingAllSidesEqually ? options : options.bottom;
  const leftPadding = isPaddingAllSidesEqually ? options : options.left;

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
  const buildPaddingRows = (numberOfRows, rowLength) => {
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
