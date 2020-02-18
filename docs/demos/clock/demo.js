import { Checkboxland } from '../../src/checkboxland.js';

const cbl = new Checkboxland({ dimensions: '35x11' });

function updateClock() {
  const currentTimeArray = getCurrentTimeString().split('');
  const initialValue = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]];
  const dataMatrix = currentTimeArray.reduce((matrix, currentChar) => {
    const currentCharacterMatrix = getCharacter(currentChar);
    return matrixConcat(matrix, currentCharacterMatrix);
  }, initialValue);

  cbl.setData(dataMatrix);
}

setInterval(updateClock, 1000);

// HELPER FUNCTIONS

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

function matrixConcat(mat1, mat2) {
  // Assumes both matrices are the same "height".
  const newMatrix = [];
  mat1.forEach((row, index) => {
    newMatrix.push(
      // the [0] puts a spacer after each character.
      row.concat(mat2[index])
         .concat([0])
    );
  });
  return newMatrix;
}

function getCharacter(character) {
  // Each character is 11 checkboxes tall.
  const zero = [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const one = [
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
  ];

  const two = [
    [0,1,1,0],
    [1,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,1,0],
    [0,0,1,0],
    [0,1,0,0],
    [0,1,0,0],
    [1,0,0,0],
    [1,1,1,1],
  ];

  const three = [
    [0,1,1,0],
    [1,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,1,1,0],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const four = [
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
  ];

  const five = [
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [0,1,1,0],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const six = [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const seven = [
    [1,1,1,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [1,0,0,0],
    [1,0,0,0],
  ];

  const eight = [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const nine = [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ];

  const colon = [
    [0],
    [0],
    [1],
    [0],
    [0],
    [0],
    [0],
    [0],
    [1],
    [0],
    [0],
  ];

  const spacer = [
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
    [0],
  ];

  const characterMap = {
    '0': zero,
    '1': one,
    '2': two,
    '3': three,
    '4': four,
    '5': five,
    '6': six,
    '7': seven,
    '8': eight,
    '9': nine,
    ':': colon,
  }

  return characterMap[character];
}
