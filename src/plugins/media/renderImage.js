import { renderMediaAsCheckboxes } from './renderMediaAsCheckboxes.js';

function renderImage(dataSource, options) {
  const checkboxland = this;
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

export default {
  name: 'renderImage',
  exec: renderImage
}

