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

  // Loop over the canvas pixels and convert them to black and white values.
  const blackAndWhiteImageData = getBlackAndWhiteImageData(context, width, height, options);

  // BEGINNING OF DEBUGGING CODE (UNCOMMENT TO DEBUG USING THE BLACK AND WHITE CANVAS)
  // context.putImageData(blackAndWhiteImageData, 0, 0);
  // document.body.appendChild(canvasEl);
  // END OF DEBUGGING CODE

  // Convert black and white image data into a checkbox matrix.
  const checkboxMatrix = convertImageDataToCheckboxMatrix(blackAndWhiteImageData);
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

function getBlackAndWhiteImageData(context, width, height, options) {
  const { threshold = 50, dithering = 'none' } = options;
  const grayscaleThreshold = (threshold / 100) * 255;
  const rgbaImageArray = context.getImageData(0, 0, width, height);
  const grayscaleImageArray = convertRgbaImageDataToGrayscale(rgbaImageArray);
  let newPixel, err;

  for (let i = 0; i < grayscaleImageArray.data.length; i += 4) {
    // Dithering techniques were borrowed from this project:
    // https://github.com/meemoo/meemooapp/blob/e799bab37dbce9865ac08676926c3b310f813d2c/src/nodes/image-monochrome-worker.js
    if (dithering === 'atkinson') {
      newPixel = grayscaleImageArray.data[i] < 129 ? 0 : 255;
      err = Math.floor((grayscaleImageArray.data[i] - newPixel) / 8);
      grayscaleImageArray.data[i] = newPixel;

      grayscaleImageArray.data[i           + 4 ] += err;
      grayscaleImageArray.data[i           + 8 ] += err;
      grayscaleImageArray.data[i + 4*width - 4 ] += err;
      grayscaleImageArray.data[i + 4*width     ] += err;
      grayscaleImageArray.data[i + 4*width + 4 ] += err;
      grayscaleImageArray.data[i + 8*width     ] += err;
    }
    else if (dithering === 'bayer') {
      let bayerThresholdMap = [
        [ 15, 135,  45, 165],
        [195,  75, 225, 105],
        [ 60, 180,  30, 150],
        [240, 120, 210,  90]
      ];
      let pixelNum  = i/4;
      let x = pixelNum % width;
      let y = Math.floor(pixelNum / width);
      let map = Math.floor((grayscaleImageArray.data[i] + bayerThresholdMap[x % 4][y % 4]) / 2);
      grayscaleImageArray.data[i] = (map < grayscaleThreshold) ? 0 : 255;
    }
    else if (dithering === 'floydsteinberg') {
      newPixel = grayscaleImageArray.data[i] < 129 ? 0 : 255;
      err = Math.floor((grayscaleImageArray.data[i] - newPixel) / 16);
      grayscaleImageArray.data[i] = newPixel;

      grayscaleImageArray.data[i           + 4 ] += err * 7;
      grayscaleImageArray.data[i + 4*width - 4 ] += err * 3;
      grayscaleImageArray.data[i + 4*width     ] += err * 5;
      grayscaleImageArray.data[i + 4*width + 4 ] += err * 1;
    } else {
      // All other dithering options (including 'none') result in a threshold approach.
      const thresholdedVal = grayscaleImageArray.data[i] > grayscaleThreshold ? 255 : 0;
      grayscaleImageArray.data[i] = thresholdedVal;
    }

    // Use the r value calculated above to set the g and b values.
    grayscaleImageArray.data[i + 1] = grayscaleImageArray.data[i];
    grayscaleImageArray.data[i + 2] = grayscaleImageArray.data[i];
  }

  return grayscaleImageArray;
};

function convertRgbaImageDataToGrayscale(rgbaImageArray) {
  // These toGrayScale function values were borrowed from here:
  // https://www.jonathan-petitcolas.com/2017/12/28/converting-image-to-ascii-art.html#turning-an-image-into-gray-colors
  const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

  for (let i = 0; i < rgbaImageArray.data.length; i += 4) {
    const r = rgbaImageArray.data[i];
    const g = rgbaImageArray.data[i + 1];
    const b = rgbaImageArray.data[i + 2];

    const grayScaleVal = toGrayScale(r, g, b);

    rgbaImageArray.data[i] = grayScaleVal;
    rgbaImageArray.data[i + 1] = grayScaleVal;
    rgbaImageArray.data[i + 2] = grayScaleVal;
    // Note: we currently ignore the transparency value;
  }

  return rgbaImageArray;
}

function convertImageDataToCheckboxMatrix(blackAndWhiteImageData) {
  const checkboxMatrix = [];
  const width = blackAndWhiteImageData.width;

  for (let i = 0; i < blackAndWhiteImageData.data.length; i += 4) {
    const pixelNum = i/4;
    const rowNumber = Math.floor(pixelNum / width);
    const rowIndex = pixelNum % width;

    if (rowIndex === 0) {
      checkboxMatrix[rowNumber] = [];
    }

    checkboxMatrix[rowNumber][rowIndex] = blackAndWhiteImageData.data[i] === 255 ? 0 : 1;
  }

  return checkboxMatrix;
}
