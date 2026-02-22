/**
 * @typedef {Object} Plugin
 * @property {string} name - The name of the plugin. This will be the name of the method added to the Checkboxland class.
 * @property {function} exec - The function that will be executed when the plugin method is called. This function should use "this" to refer to the Checkboxland instance.
 * @property {function} [cleanUp] - An optional function that will be executed when the plugin is cleaned up. This is useful for plugins that set up intervals, event listeners, or other resources that need to be cleaned up to prevent memory leaks.
 */

export class Checkboxland {

  /**
   * @param {{ fillValue?: number, dimensions?: string, selector?: string }} props
   */
  constructor(props = {}) {
    if (typeof props.fillValue !== 'undefined') _checkForValidValue(props.fillValue);

    this.dimensions = _textDimensionsToArray(props.dimensions || '8x8');
    /**
     * @public
     * @type {HTMLElement}
     */
    this.displayEl = _getValidHTMLContainer(props.selector);
    this.#data = this.getEmptyMatrix({ fillValue: props.fillValue || 0 });

    _createInitialCheckboxDisplay(this.displayEl, this.#data);
  }

  /**
   * Private property for storing the checkbox data matrix
   * @type {number[][]}
   */
  #data;

  /**
   * Gets the value of a specific checkbox in the matrix.
   * @param {number} x - The x-coordinate of the checkbox.
   * @param {number} y - The y-coordinate of the checkbox.
   * @returns {number} The value of the checkbox (0, 1, or 2).
   */
  getCheckboxValue(x, y) {
    const isWithinDisplay = (x >= 0 && y >= 0 && x < this.dimensions[0] && y < this.dimensions[1]);

    if (!isWithinDisplay) {
      throw new Error(`The location (x: ${x}, y: ${y}) is outside of this checkbox display`);
    }

    return this.#data[y][x];
  }

  /**
   * Sets the value of a specific checkbox in the matrix.
   * @param {number} x - The x-coordinate of the checkbox.
   * @param {number} y - The y-coordinate of the checkbox.
   * @param {number} newValue - The new value to set (0, 1, or 2).
   * @returns {void}
   */
  setCheckboxValue(x, y, newValue) {
    const isWithinDisplay = (x >= 0 && y >= 0 && x < this.dimensions[0] && y < this.dimensions[1]);

    _checkForValidValue(newValue);

    if (!isWithinDisplay) return;

    this.#data[y][x] = newValue;

    // We can assume the checkboxEl exists because it's within the display.
    const checkboxEl = /** @type {HTMLInputElement} */ (this.displayEl.children[y].children[x]);

    // Handle indeterminate newValues
    if (newValue === 2) {
      if (checkboxEl.indeterminate) return;

      checkboxEl.indeterminate = true;
      // The indeterminate state masks the checked state, so we always
      // uncheck indeterminate checkboxes to prevent weird state combinations.
      checkboxEl.checked = false;
    }
    // Handle non-indeterminate newValues
    else {
      // Remove any previously set indeterminate values.
      if (checkboxEl.indeterminate) {
        checkboxEl.indeterminate = false;
      }

      // If the checkbox value matches, then we don't need to update it.
      if (checkboxEl.checked === Boolean(newValue)) return;

      checkboxEl.checked = Boolean(newValue);
    }
  }

  getData() {
    const clonedData = this.#data.map((row) => row.slice());
    return clonedData;
  }

  /**
   * Sets the data for the checkbox matrix.
   * @param {number[][]} data - The new data to set.
   * @param {{ x?: number, y?: number, fillValue?: number }} options - Options for setting the data.
   */
  setData(data, options = {}) {
    const { x = 0, y = 0, fillValue } = options;
    const isFillValueProvided = (typeof fillValue !== 'undefined');
    const colNum = this.dimensions[0];
    const rowNum = this.dimensions[1];

    _checkForValidMatrix(data);

    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
      for (let colIndex = 0; colIndex < colNum; colIndex++) {
        let isBeforeStartingXPos = (colIndex < x);
        let isBeforeStartingYPos = (rowIndex < y);
        let isBeyondProvidedXPlusData = (colIndex >= x + data[0].length);
        let isBeyondProvidedYPlusData = (rowIndex >= y + data.length);
        let isOutsideOfProvidedData = (isBeforeStartingXPos || isBeforeStartingYPos || isBeyondProvidedXPlusData || isBeyondProvidedYPlusData);

        if (isOutsideOfProvidedData && !isFillValueProvided) continue;

        let valueToSet = /** @type {number} */ (isOutsideOfProvidedData ? fillValue : data[rowIndex - y][colIndex - x]);

        this.setCheckboxValue(colIndex, rowIndex, valueToSet);
      }
    }
  }

  clearData() {
    const emptyMatrix = this.getEmptyMatrix();
    this.setData(emptyMatrix);
  }

  /**
   * This kind of method makes more sense as a plugin but I needed to
   * use it in the core library anyways so I decided to expose it here.
   * @param {{ fillValue?: number, width?: number, height?: number }} options
   * @returns {number[][]}
   */
  getEmptyMatrix(options = {}) {
    const { fillValue = 0, width = this.dimensions[0], height = this.dimensions[1] } = options;
    /**
     * @type {number[][]}
     */
    const matrix = [];

    for (let i = 0; i < height; i++) {
      matrix[i] = [];
      for (let j = 0; j < width; j++) {
        matrix[i][j] = fillValue;
      }
    }

    return matrix;
  }

  /**
   * Extends the checkboxland class with a new plugin.
   * @param {Plugin} pluginObj 
   */
  static extend(pluginObj) {
    if (!pluginObj || typeof pluginObj !== 'object') {
      throw new Error('You must provide a plugin object to extend checkboxland.');
    }

    const { name, exec, cleanUp } = pluginObj;

    if (!name || !exec) {
      throw new Error('Your plugin must have a "name" and an "exec" function.');
    }

    if (typeof name !== 'string' || typeof exec !== 'function') {
      throw new Error('The "name" must be a string and "exec" must be a function.');
    }

    if (this.prototype.hasOwnProperty(name)) {
      throw new Error(`Plugin "${name}" already exists on checkboxland. Please choose a different name.`);
    }

    if (cleanUp) {
      // @ts-ignore
      exec.cleanUp = cleanUp;
    }

    // @ts-ignore
    this.prototype[name] = exec;
  }
}


// Private helper functions

/**
 * Checks if the provided value is a valid checkbox value (0, 1, or 2).
 * @param {number} value 
 * @returns {void}
 * @throws Will throw an error if the value is not valid.
 */
function _checkForValidValue(value) {
  if (value === 0 || value === 1 || value === 2) return;

  throw new Error(`${value} is not a valid checkbox value.`);
}

/**
 * Checks if the provided matrix is a valid checkbox matrix. A valid matrix is a 2D array (array of arrays).
 * @param {number[][]} matrix 
 * @returns {void}
 * @throws Will throw an error if the matrix is not valid.
 */
function _checkForValidMatrix(matrix) {
  if (Array.isArray(matrix) && Array.isArray(matrix[0])) return;

  throw new Error(`${matrix} is not a valid matrix.`);
}

/**
 * Gets a valid HTML container element from the provided selector. The selector can be either a string (CSS selector) or an actual HTML element. If the selector is invalid, an error is thrown.
 * @param {string | HTMLElement} selector 
 * @returns {HTMLElement}
 */
function _getValidHTMLContainer(selector = '#checkboxland') {
  if (selector instanceof HTMLElement) {
    return selector;
  }

  if (typeof selector === 'string') {
    const el = document.querySelector(selector);

    // querySelector can return any Element,
    // and we need a valid styleable HTMLElement.
    if (!el || !(el instanceof HTMLElement)) {
      throw new Error(`No element found for the selector "${selector}".`);
    }

    return el;
  }

  throw new Error(`Checkboxland selector is invalid.`);
}

/**
 * Converts a text representation of dimensions (e.g., "100x200") into an array of numbers. The text must be in the format "widthxheight". If the format is invalid, an error is thrown.
 * @param {string} textDimensions - The text representation of dimensions.
 * @returns {number[]}
 */
function _textDimensionsToArray(textDimensions) {
  const errorMessage = 'The dimensions you provided are invalid.';

  if (typeof textDimensions !== 'string') throw new Error(errorMessage);

  const dimArray = textDimensions.split('x').map(val => Number(val));
  const isValid = (dimArray.length === 2 && !isNaN(dimArray[0]) && !isNaN(dimArray[0]));

  if (!isValid) throw new Error(errorMessage);

  return textDimensions.split('x').map(val => Number(val));
}

/**
 * Creates the initial checkbox display.
 * @param {HTMLElement} displayEl 
 * @param {number[][]} data 
 */
function _createInitialCheckboxDisplay(displayEl, data) {
  displayEl.innerHTML = '';
  displayEl.style.overflowX = 'auto';

  data.forEach(rowData => {
    const rowEl = document.createElement('div');
    rowEl.style.lineHeight = '0.75';
    rowEl.style.whiteSpace = 'nowrap';

    rowData.forEach(cellData => {
      const checkboxEl = document.createElement('input');
      const indeterminateVal = cellData === 2 ? true : false;
      const checkedVal = indeterminateVal ? false : Boolean(cellData);

      checkboxEl.style.margin = '0';
      checkboxEl.style.verticalAlign = 'top';
      checkboxEl.type = 'checkbox';
      checkboxEl.tabIndex = -1;
      checkboxEl.checked = checkedVal;
      checkboxEl.indeterminate = indeterminateVal;

      rowEl.appendChild(checkboxEl);
    });

    displayEl.appendChild(rowEl);
  });
}
