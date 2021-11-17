import { orderedDither, atkinsonDither, errorDiffusionDither } from './dithering-algorithms.js'
import { blackAndWhiteThreshold, sharpen } from './thresholds.js';

let canvasEl;
let context;

export function renderMediaAsCheckboxes(element, options = {}, checkboxland) {
  if (!canvasEl) {
    canvasEl = document.createElement('canvas');
    context = canvasEl.getContext('2d');
  }

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

  // Draw the original image on the tiny canvas (`drawImage` will scale the
  // image as needed to make it fit the canvas).
  context.drawImage(element, 0, 0, width, height);

  // Loop over the canvas pixels and apply an image algorithm (like dithering or thresholding).
  const imageData = applyImageAlgorithm(context, width, height, options);

  const checkboxMatrix = convertImageDataToCheckboxMatrix(imageData);
  checkboxland.setData(checkboxMatrix, options);
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

function applyImageAlgorithm(context, width, height, options) {
  const { threshold = 50, dithering = 'none' } = options;

  let imageData = context.getImageData(0, 0, width, height),
      imageUint8data;

  const algorithms = {
    'ordered': orderedDither,
    'atkinson': atkinsonDither,
    'errorDiffusion': errorDiffusionDither,
  };

  if (dithering === 'none') {
    imageUint8data = blackAndWhiteThreshold(imageData.data, threshold);
  } else {
    // Use "sharpen" as a way of applying a threshold value to dithered approaches.
    imageUint8data = sharpen(context, imageData, threshold / 100);
    imageUint8data = algorithms[dithering]({ uint8data: imageUint8data, w: width, h: height });
  }

  imageData.data.set(imageUint8data);

  return imageData;
}

function convertImageDataToCheckboxMatrix(imageData) {
  const checkboxMatrix = [];
  const width = imageData.width;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const pixelNum = i/4;
    const rowNumber = Math.floor(pixelNum / width);
    const rowIndex = pixelNum % width;

    if (rowIndex === 0) {
      checkboxMatrix[rowNumber] = [];
    }

    checkboxMatrix[rowNumber][rowIndex] = imageData.data[i] === 255 ? 0 : 1;
  }

  return checkboxMatrix;
}
