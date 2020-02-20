export class Checkboxland {
  constructor(props = {}) {
    this.displayEl = document.querySelector(props.selector || '#checkboxland');
    this.dimensions = _textDimensionsToArray(props.dimensions || '8x8');

    // The data object. Don't access this directly. Use methods like getData() and setData() instead.
    // Maybe we can restrict access to this variable in the future, using Proxies. See examples here:
    // https://github.com/bryanbraun/music-box-fun/commit/f399255261e9b8ab9fb8c10edbbedd55a639e9d1
    this._data = _getEmptyMatrix(this.dimensions[0], this.dimensions[1]);

    _createInitialCheckboxDisplay(this.displayEl, this._data);
  }

  getCheckboxValue(x, y) {
    return this._data[y][x];
  }

  setCheckboxValue(x, y, val) {
    const isValueValid = (val === 0 || val === 1);
    const isWithinDisplay = (typeof this._data[y] !== 'undefined' && typeof this._data[y][x] !== 'undefined');

    if (!isValueValid) {
      throw new Error(`${val} is not a valid checkbox value`);
    }

    if (!isWithinDisplay) return;

    this._data[y][x] = val;

    // We can assume the checkboxEl exists because it's within the display.
    const checkboxEl = this.displayEl.children[y].children[x];
    const isCellChecked = Boolean(val);

    if (checkboxEl.checked === isCellChecked) return;

    checkboxEl.checked = isCellChecked;
  }

  getData() {
    const clonedData = this._data.map((row) => row.slice());
    return clonedData;
  }

  setData(data) {
    data.forEach((rowData, rowIndex) => {
      rowData.forEach((cellValue, cellIndex) => {
        this.setCheckboxValue(cellIndex, rowIndex, cellValue);
      });
    });
  }

  clearData() {
    const emptyMatrix = _getEmptyMatrix(this.dimensions[0], this.dimensions[1]);
    this.setData(emptyMatrix);
  }

  static extend(fn) {
    if (!fn.name) {
      throw new Error('Your plugin must be a function with a "name" property.');
    }

    this.prototype[fn.name] = fn;
  }
}


// Private helper functions

function _getEmptyMatrix(width, height) {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    matrix[i] = [];
    for (let j = 0; j < width; j++) {
      matrix[i][j] = 0;
    }
  }

  return matrix;
}

function _textDimensionsToArray(textDimensions) {
  const errorMessage = 'The dimensions you provided are invalid.';

  if (typeof textDimensions !== 'string') throw new Error(errorMessage);

  const dimArray = textDimensions.split('x').map(val => Number(val));
  const isValid = (dimArray.length === 2 && !isNaN(dimArray[0]) && !isNaN(dimArray[0]));

  if (!isValid) throw new Error(errorMessage);

  return textDimensions.split('x').map(val => Number(val));
}

function _createInitialCheckboxDisplay(displayEl, data) {
  displayEl.innerHTML = '';
  displayEl.style.overflowX = 'auto';

  data.forEach(rowData => {
    const rowEl = document.createElement('div');
    rowEl.style.lineHeight = 0.75;
    rowEl.style.whiteSpace = 'nowrap';

    rowData.forEach(cellData => {
      const checkboxEl = document.createElement('input');
      checkboxEl.style.margin = 0;
      checkboxEl.style.verticalAlign = 'top';
      checkboxEl.type = 'checkbox';
      rowEl.appendChild(checkboxEl);
    });

    displayEl.appendChild(rowEl);
  });
}
