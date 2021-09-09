import { Checkboxland } from '../../../src/index.js';

const selector = '#checkboxland';
const checkboxDisplayWidth = 45;
const checkboxDisplayHeight = 45;
const dimensions = `${checkboxDisplayWidth}x${checkboxDisplayHeight}`;
const fillValue = 0;

const cbl = new Checkboxland({ selector, dimensions, fillValue });

const videoEl = document.querySelector('video');
const thresholdEl = document.querySelector('#threshold');

thresholdEl.addEventListener('input', event => {
  cbl.renderVideo.cleanUp();
  cbl.renderVideo(videoEl, { threshold: Number(event.target.value) });
});

const populateVideo = async videoEl => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 540, height: 540 } });
  videoEl.srcObject = stream;
  await videoEl.play();
}

populateVideo(videoEl)
  .then(() => {
    cbl.renderVideo(videoEl, { threshold: Number(thresholdEl.value) });
  });

