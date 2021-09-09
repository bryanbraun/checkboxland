let canvasEl;
let context;
let grayscaleThreshold;

export function renderMediaAsCheckboxes(element, options = {}, checkboxland) {
  if (!canvasEl) {
    canvasEl = document.createElement('canvas');
    context = canvasEl.getContext('2d');
  }

  grayscaleThreshold = ((options.threshold || 50) / 100) * 255;

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
  // These toGrayScale function values were borrowed from here:
  // https://www.jonathan-petitcolas.com/2017/12/28/converting-image-to-ascii-art.html#turning-an-image-into-gray-colors
  const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

  const rgbaImageArray = context.getImageData(0, 0, width, height);
  const pixelMatrix = [];

  for (let i = 0 ; i < rgbaImageArray.data.length ; i += 4) {
    const r = rgbaImageArray.data[i];
    const g = rgbaImageArray.data[i + 1];
    const b = rgbaImageArray.data[i + 2];

    const grayScaleVal = toGrayScale(r, g, b);

    const thresholdedVal = grayScaleVal > grayscaleThreshold ? 255 : 0;

    // We overwrite the pixels with their black and white counterparts and
    // return rgbaImageArray in case we ever want to preview it on a canvas.
    rgbaImageArray.data[i] = thresholdedVal;
    rgbaImageArray.data[i + 1] = thresholdedVal;
    rgbaImageArray.data[i + 2] = thresholdedVal;
    // Note: we currently ignore the transparency value;

    const pixelNum = i/4;
    const rowNumber = Math.floor(pixelNum / width);
    const rowIndex = pixelNum % width;

    if (rowIndex === 0) {
      pixelMatrix[rowNumber] = [];
    }

    pixelMatrix[rowNumber][rowIndex] = grayScaleVal > grayscaleThreshold ? 0 : 1;
  }

  return [rgbaImageArray, pixelMatrix];
};
