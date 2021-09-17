import { Checkboxland } from '../../../src/index.js';

const width = 68;
const height = 51;
const dimensions = `${width}x${height}`;

const cbl = new Checkboxland({ dimensions });

// Original source video: https://archive.org/details/TouhouBadApple
const videoEl = document.querySelector('video');

cbl.renderVideo(videoEl);
