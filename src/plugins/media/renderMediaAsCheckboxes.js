let canvasEl;
let context;
let sharpening;

import {sharpen} from './sharpen.js';

// There is some weirdness how dither.js is imported
// I don't have energy to reverse engineer require/import/export/default mindf*ks, so let's just call it twice
import DitherJSImport from './dither.js'
const DitherJS = DitherJSImport();

const ditherjsOptions = {
  "step": 1, // The step for the pixel quantization n = 1,2,3...
  "palette": [[60,136,253], [255, 255, 255], ], // an array of colors as rgb arrays; first is "checkbox blue", second is white
  "algorithm": "ordered" // one of ["ordered", "diffusion", "atkinson"]
}

const ditherjs = new DitherJS([ditherjsOptions]);

export function renderMediaAsCheckboxes(element, options = {}, checkboxland) {
  if (!canvasEl) {
    canvasEl = document.createElement('canvas');
    context = canvasEl.getContext('2d');
  }

  // default is 50, but we want to be able to pass 0
  let s = options.sharpening == null ? 50 : options.sharpening;

  sharpening = (s / 100);

  // Create a tiny canvas. Each pixel on the canvas will represent a checkbox.
  canvasEl.width = checkboxland.dimensions[0];
  canvasEl.height = checkboxland.dimensions[1];

  // Clear the canvas before applying a new image. We use a white rectangle
  // in order for PNGs with transparency to appear over a white background
  // (which seems to be most appropriate in the use-cases I can think of).
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // Determine the ideal dimensions for our media, such that it fills
  // as much of the checkbox grid as possible without overflowing.
  const [mediaWidth, mediaHeight] = getMediaDimensions(element);
  const [width, height] = clampDimensions(mediaWidth, mediaHeight, canvasEl.width, canvasEl.height);

  // Draw the image on the tiny canvas (`drawImage` will scale the image
  // as needed to make it fit the canvas).
  context.drawImage(element, 0, 0, width, height);

  // Loop over the canvas pixels and convert them to black and white values.
  const [_, pixelMatrix] = getBlackAndWhiteImageData(context, width, height);

  checkboxland.setData(pixelMatrix, options);
}

function getMediaDimensions(mediaEl) {
  let width = 0, height = 0;

  switch (mediaEl.tagName) {
    case 'IMG':
      width = mediaEl.width;
      height = mediaEl.height;
      break;
    case 'VIDEO':
      width = mediaEl.videoWidth;
      height = mediaEl.videoHeight;
      break;
  }

  return [width, height];
}

function clampDimensions(imageWidth, imageHeight, canvasWidth, canvasHeight) {
  const heightRatio = imageHeight / canvasHeight;
  const widthRatio = imageWidth / canvasWidth;

  // If the image is unconstrained (ie. very small images), return the dimensions as-is.
  if (heightRatio < 1 && widthRatio < 1) {
    return [imageWidth, imageHeight];
  }

  const getDimensionsClampedByHeight = () => {
    const reducedWidth = Math.floor(imageWidth * canvasHeight / imageHeight);
    return [reducedWidth, canvasHeight];
  }

  const getDimensionsClampedByWidth = () => {
    const reducedHeight = Math.floor(imageHeight * canvasWidth / imageWidth);
    return [canvasWidth, reducedHeight];
  }

  // Determine the most constrained dimension, and clamp accordingly.
  return heightRatio > widthRatio ?
    getDimensionsClampedByHeight() :
    getDimensionsClampedByWidth();
};

function getBlackAndWhiteImageData(context, width, height) {
  const original = context.getImageData(0, 0, width, height);

  const sharpened = sharpen(context, original, sharpening);

  const dithered = sharpened
  ditherjs.ditherImageData(dithered, ditherjsOptions);

  const pixelMatrix = [];

  for (let i = 0 ; i < dithered.data.length ; i += 4) {
    const r = dithered.data[i];

    const pixelNum = i/4;
    const rowNumber = Math.floor(pixelNum / width);
    const rowIndex = pixelNum % width;

    if (rowIndex === 0) {
      pixelMatrix[rowNumber] = [];
    }

    pixelMatrix[rowNumber][rowIndex] = r==255 ? 0 : 1;
  }

  return [dithered, pixelMatrix];
}
