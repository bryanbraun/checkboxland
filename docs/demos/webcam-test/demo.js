import { Checkboxland } from '../../../src/index.js';

const selector = '#checkboxland';
const checkboxDisplayWidth = 45;
const checkboxDisplayHeight = 45;
const CHECKBOX_LENGTH = 12;
const dimensions = `${checkboxDisplayWidth}x${checkboxDisplayHeight}`;
const fillValue = 0;

const cbl = new Checkboxland({ selector, dimensions, fillValue });

const videoEl = document.querySelector('video');
const sharpeningEl = document.querySelector('#sharpening');

sharpeningEl.addEventListener('input', event => {
  cbl.renderVideo.cleanUp();
  cbl.renderVideo(videoEl, { sharpening: Number(event.target.value) });
});

const populateVideo = async videoEl => {
  const constraints = {
    audio: false,
    video: {
      width: checkboxDisplayWidth * CHECKBOX_LENGTH,
      height: checkboxDisplayHeight * CHECKBOX_LENGTH,
      facingMode: 'user',
    },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoEl.srcObject = stream;
  await videoEl.play();
}

populateVideo(videoEl)
  .then(() => {
    cbl.renderVideo(videoEl, { sharpening: Number(sharpeningEl.value) });
  });

