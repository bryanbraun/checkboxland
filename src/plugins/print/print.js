import { fiveBySeven } from './font-5x7.js';

function print(text, options = {}) {
  const { dataOnly = false, font = fiveBySeven, x = 0, y = 0, fillValue } = options;
  const isFillValueProvided = (typeof fillValue !== 'undefined');
  const textArray = text.split('');

  const textMatrix = textArray.reduce((matrix, currentChar) => {
    const currentCharacterMatrix = font[currentChar];
    return _matrixConcat(matrix, currentCharacterMatrix);
  }, []);

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
function _matrixConcat(mat1, mat2) {
  if (mat1.length === 0) return mat2;

  const newMatrix = [];

  mat1.forEach((row, index) => {
    // We go row by row, concatenating mat1 to mat2.
    newMatrix.push(
      // the [0] puts a spacer between the two characters.
      row.concat([0]).concat(mat2[index])
    );
  });

  return newMatrix;
}

export default {
  name: 'print',
  exec: print
}
