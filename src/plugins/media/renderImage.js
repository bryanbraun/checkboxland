import { renderMediaAsCheckboxes } from './renderMediaAsCheckboxes.js';

/**
 * Renders an image element as checkboxes.
 * 
 * @this {import('../../checkboxland.js').Checkboxland}
 * @param {string | HTMLImageElement} dataSource - The image source (URL or <img> element).
 * @param {Object} options - The options for rendering.
 */
function renderImage(dataSource, options) {
  const checkboxland = this;
  /** @type {HTMLImageElement} */
  let imageEl;

  // FOR PASSING A URL TO AN IMAGE
  if (typeof dataSource === 'string') {
    imageEl = new Image();
    imageEl.crossOrigin = 'anonymous'; // allow cross-origin loading.
    imageEl.addEventListener('load', () => renderMediaAsCheckboxes(imageEl, options, checkboxland), { once: true });
    imageEl.src = dataSource;
  } else
  // FOR PASSING AN <IMG> ELEMENT
  if (typeof dataSource === 'object') {
    if (dataSource.complete) {
      renderMediaAsCheckboxes(dataSource, options, checkboxland);
    } else {
      dataSource.addEventListener('load', () => renderMediaAsCheckboxes(dataSource, options, checkboxland), { once: true });
    }
  }
}

/**
 * @type {import('../../checkboxland.js').Plugin}
 */
export default {
  name: 'renderImage',
  exec: renderImage
}

