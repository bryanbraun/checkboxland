import { fiveBySeven } from './font-5x7.js';

/**
 * @this {import('../../checkboxland.js').Checkboxland}
 * @param {string} text 
 * @param {{ dataOnly?: boolean, font?: typeof fiveBySeven, x?: number, y?: number, fillValue?: number }} options 
 * @returns 
 */
function print(text, options = {}) {
  const { dataOnly = false, font = fiveBySeven, x = 0, y = 0, fillValue } = options;
  const isFillValueProvided = (typeof fillValue !== 'undefined');
  const textArray = text.split('');

  const textMatrix = textArray.reduce((matrix, currentChar) => {
    // @ts-ignore
    const currentCharacterMatrix = font[currentChar];
    return _matrixConcat(matrix, currentCharacterMatrix);
  }, /** @type {number[][]} */ ([]));

  // Handle an edge-case where an empty string produces an empty
  // array instead of an empty matrix (which is what we'd prefer).
  if (textMatrix.length === 0) {
    textMatrix.push([]);
  }

  if (dataOnly) {
    if (!isFillValueProvided) return textMatrix;

    let dataMatrix = this.getEmptyMatrix({ fillValue });

    textMatrix.forEach((rowData, rowIndex) => {
      rowData.forEach((cellValue, cellIndex) => {
        dataMatrix[rowIndex + y][cellIndex + x] = cellValue;
      });
    });

    return dataMatrix;
  }

  this.setData(textMatrix, { x, y, fillValue });
}

// HELPER FUNCTIONS

/**
 * @param {number[][]} mat1 
 * @param {number[][]} mat2 
 * @returns {number[][]}
 */
function _matrixConcat(mat1, mat2) {
  if (mat1.length === 0) return mat2;

  const newMatrix = /** @type {number[][]} */ ([]);

  mat1.forEach((row, index) => {
    // We go row by row, concatenating mat1 to mat2.
    newMatrix.push(
      // the [0] puts a spacer between the two characters.
      row.concat([0]).concat(mat2[index])
    );
  });

  return newMatrix;
}

/**
 * @type {import('../../checkboxland.js').Plugin}
 */
export default {
  name: 'print',
  exec: print
}
