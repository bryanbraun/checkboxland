import { fiveBySeven } from './font-5x7.js';

export function print(text, options = {}) {
  const textArray = text.split('');
  const font = options.font || fiveBySeven;

  const dataMatrix = textArray.reduce((matrix, currentChar) => {
    const currentCharacterMatrix = font[currentChar];
    return _matrixConcat(matrix, currentCharacterMatrix);
  }, []);

  if (options.dataOnly) {
    return dataMatrix;
  }

  this.setData(dataMatrix);
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

