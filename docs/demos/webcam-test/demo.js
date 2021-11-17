import { Checkboxland } from '../../../src/index.js';

const selector = '#checkboxland';
const checkboxDisplayWidth = 45;
const checkboxDisplayHeight = 45;
const CHECKBOX_LENGTH = 12;
const dimensions = `${checkboxDisplayWidth}x${checkboxDisplayHeight}`;
const fillValue = 0;

const cbl = new Checkboxland({ selector, dimensions, fillValue });

const videoEl = document.querySelector('video');
const thresholdEl = document.querySelector('#threshold');
const ditheringEl = document.querySelector('#dithering');

thresholdEl.addEventListener('input', event => {
  cbl.renderVideo.cleanUp();
  cbl.renderVideo(videoEl, { threshold: Number(event.target.value), dithering: ditheringEl.value });
});

ditheringEl.addEventListener('change', event => {
  cbl.renderVideo.cleanUp();
  cbl.renderVideo(videoEl, { threshold: Number(thresholdEl.value), dithering: event.target.value });
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
    cbl.renderVideo(videoEl, { threshold: Number(thresholdEl.value), dithering: ditheringEl.value });
  });

