import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const CHECKBOX_LENGTH = 12;
const dimensions = `${width}x${height}`;

let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  const videoEl = document.createElement('video');
  videoEl.setAttribute('autoplay', '');
  videoEl.setAttribute('muted', '');
  videoEl.setAttribute('playsinline', '');

  const populateVideo = async videoEl => {
    const constraints = {
      audio: false,
      video: {
        width: width * CHECKBOX_LENGTH,
        height: height * CHECKBOX_LENGTH,
        facingMode: 'user',
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = stream;
    await videoEl.play();
  }

  populateVideo(videoEl)
    .then(() => {
      cbl.renderVideo(videoEl);
    });

  return cbl;
}

function cleanUp() {
  cbl.renderVideo.cleanUp();
}

export {
  init,
  dimensions,
  cleanUp,
}
