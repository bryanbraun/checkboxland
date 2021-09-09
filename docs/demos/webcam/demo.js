import { Checkboxland } from '../../../src/index.js';

const width = 44;
const height = 15;
const CHECKBOX_LENGTH = 12;
const dimensions = `${width}x${height}`;

let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  const videoEl = document.createElement('video');

  const populateVideo = async videoEl => {
    const webcamDimensions = {
      width: width * CHECKBOX_LENGTH,
      height: height * CHECKBOX_LENGTH,
    };
    const stream = await navigator.mediaDevices.getUserMedia({ video: webcamDimensions });
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
