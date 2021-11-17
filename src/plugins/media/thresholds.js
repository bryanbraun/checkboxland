export function blackAndWhiteThreshold(rgbaImageData, threshold) {
  // These toGrayScale function values were borrowed from here:
  // https://www.jonathan-petitcolas.com/2017/12/28/converting-image-to-ascii-art.html#turning-an-image-into-gray-colors
  const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;
  const grayscaleThreshold = (threshold / 100) * 255;

  for (let i = 0; i < rgbaImageData.length; i += 4) {
    // convert pixel to grayscale
    const r = rgbaImageData[i];
    const g = rgbaImageData[i + 1];
    const b = rgbaImageData[i + 2];
    const grayScaleVal = toGrayScale(r, g, b);

    // convert to black/white, based on the threshold
    const thresholdedVal = grayScaleVal > grayscaleThreshold ? 255 : 0;

    // set the thresholded values into the array
    rgbaImageData[i] = thresholdedVal;
    rgbaImageData[i + 1] = thresholdedVal;
    rgbaImageData[i + 2] = thresholdedVal;
    // Note: we currently ignore the transparency value;
  }

  return rgbaImageData;
}

// copied with adjustments from https://gist.github.com/mikecao/65d9fc92dc7197cb8a7c
export function sharpen(context, imageData, mix) {
  const w = imageData.width;
  const h = imageData.height;
  const srcBuff = imageData.data;
  const weights = [ 0, -1,  0,
			             -1,  5, -1,
			              0, -1,  0];
  const katet = Math.round(Math.sqrt(weights.length));
  const half = (katet * 0.5) | 0;
  const dstData = context.createImageData(w, h);
  const dstBuff = dstData.data;

  for (let y = h; y>=0; y--) {
    for (let x = w; x>=0; x--) {
      const sy = y;
      const sx = x;
      const dstOff = (y * w + x) * 4;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let cy = 0; cy < katet; cy++) {
        for (let cx = 0; cx < katet; cx++) {
          const scy = sy + cy - half;
          const scx = sx + cx - half;

          if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
            const srcOff = (scy * w + scx) * 4;
            const wt = weights[cy * katet + cx];

            r += srcBuff[srcOff] * wt;
            g += srcBuff[srcOff + 1] * wt;
            b += srcBuff[srcOff + 2] * wt;
            a += srcBuff[srcOff + 3] * wt;
          }
        }
      }

      dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
      dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
      dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
      dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
    }
  }

  // fix first column by just copying original data... dumb but works
  for (let y = h; y>=0; y--) {
    const x = 0;
    const dstOff = (y * w + x) * 4;
    dstBuff[dstOff] = srcBuff[dstOff];
    dstBuff[dstOff + 1] = srcBuff[dstOff + 1];
    dstBuff[dstOff + 2] = srcBuff[dstOff + 2];
    dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
  }

  return dstBuff;
}
