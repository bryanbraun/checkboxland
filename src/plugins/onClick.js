/**
 * @type {((this: HTMLElement, ev: MouseEvent) => any) | null}
 */
let handleFun = null;
/**
 * @type {HTMLElement | null}
 */
let displayEl = null;

/** @typedef {(evt: ClickEventResult) => void | { handleEvent: (evt: ClickEventResult) => void }} Callback */

/**
 * @this {import('../checkboxland.js').Checkboxland}
 * @param {Callback} callback 
 */
function onClick(callback) {
  displayEl = this.displayEl;
  handleFun = handleEvent.bind(this, callback);
  displayEl.addEventListener('click', handleFun);
}

/**
 * @typedef {Object} ClickEventResult
 * @property {number} x - The x coordinate of the clicked checkbox.
 * @property {number} y - The y coordinate of the clicked checkbox.
 * @property {HTMLElement} checkbox - The checkbox element that was clicked.
 */

/**
 * @param {Callback} callback 
 * @param {Event} event 
 */
function handleEvent(callback, event) {
  if (!displayEl) {
    throw new Error('Cannot handle click event before onClick plugin has been initialized');
  }

  const coords = findCoords(displayEl, /** @type {HTMLElement} */ (event.target));
  if (!coords) {
    return;
  }

  const result = {
    x: coords.x,
    y: coords.y,
    checkbox: /** @type {HTMLElement} */ (event.target),
  }

  if ('handleEvent' in callback && typeof callback.handleEvent === 'function') {
    callback.handleEvent(result);
  } else if (typeof callback === 'function') {
    callback(result);
  } else {
    throw new TypeError('Callback should be a function or an EventListener object');
  }
}

/**
 * @param {HTMLElement} root 
 * @param {HTMLElement} target 
 * @returns 
 */
function findCoords(root, target) {
  for (let y = 0; y < root.children.length; y += 1) {
    const div = root.children[y];
    for (let x = 0; x < div.children.length; x += 1) {
      const checkbox = div.children[x];
      if (checkbox === target) {
        return { x, y };
      }
    }
  }
  return null;
}

function cleanUp() {
  if (!handleFun || !displayEl) {
    throw new Error('Cannot clean up onClick plugin before it has been initialized');
  }
  displayEl.removeEventListener('click', handleFun);
}

/**
 * @type {import('../checkboxland.js').Plugin}
 */
export default {
  name: 'onClick',
  exec: onClick,
  cleanUp: cleanUp,
}
