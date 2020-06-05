import { Checkboxland } from '../../../src/index.js';
import './qrcode.js';

const checkboxlandEl = document.getElementById('checkboxland');

let dimensions = '44x25';
let qrId = 'qrImg';
let interval = 1000;
let intervalId;
let qrLib;
let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  insertNewQrDiv();
  qrLib = new window.QRCode(qrId);
  updateClock();
  intervalId = setInterval(updateClock, interval);

  return cbl;
}

function updateClock() {
  updateQrCode(getCurrentTimeString());
}

function cleanUp() {
  document.getElementById(qrId).remove();
  clearInterval(intervalId);
}

function insertNewQrDiv() {
  const newDiv = document.createElement("div");

  newDiv.style.display = 'none';
  newDiv.id = qrId;

  const parentEl = checkboxlandEl.parentNode;

  // Insert the new element into before sp2
  parentEl.insertBefore(newDiv, checkboxlandEl);
}

function getCurrentTimeString() {
  const date = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  const timeString = date.toLocaleString('en-US', options);
  return `${timeString}`;
}

function updateQrCode(string) {
	qrLib.makeCode(string);

  const data = qrLib._oQRCode.modules;
  const qrData = convertMatrixToBinary(data);
  cbl.setData(qrData, { x: 9 });
}

function convertMatrixToBinary(data) {
  const newMatrix = [];

  for (let i = 0; i < data.length; i++) {
    newMatrix[i] = [];
    for (let j = 0; j < data[i].length; j++) {
      newMatrix[i][j] = data[i][j] === true ? 1 : 0;
    }
  }

  return newMatrix;
}

export {
  init,
  cleanUp,
  dimensions,
}
