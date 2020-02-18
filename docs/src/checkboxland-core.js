export class Checkboxland {
  constructor(props) {
    this.displayEl = document.querySelector(props && props.selector || '#checkboxland');
    this.dimensions = _textDimensionsToArray(props && props.dimensions || '8x8');
    this.data = _getEmptyMatrix(this.dimensions[0], this.dimensions[1]);

    _createInitialCheckboxDisplay(this.displayEl, this.data);
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;

    // Update the display.
    this.data.forEach((rowData, rowIndex) => {
      const rowEl = this.displayEl.querySelector(`div:nth-child(${rowIndex + 1})`);

      if (!rowEl) return;

      rowData.forEach((cellData, cellIndex) => {
        const checkboxEl = rowEl.querySelector(`input:nth-child(${cellIndex + 1})`);

        if (!checkboxEl) return;

        checkboxEl.checked = Boolean(cellData);
      });
    });
  }

  clearData() {
    const emptyMatrix = _getEmptyMatrix(this.dimensions[0], this.dimensions[1]);
    this.setData(emptyMatrix);
  }

  static extend(fn) {
    this.prototype[fn.name] = fn;
  }
}


// Private helper functions

function _getEmptyMatrix(width, height) {
  return Array(height).fill(
    Array(width).fill(0)
  );
}

function _textDimensionsToArray(textDimensions) {
  return textDimensions.split('x').map(val => Number(val));
}

function _createInitialCheckboxDisplay(displayEl, data) {
  displayEl.innerHTML = '';
  displayEl.style = 'overflow: scroll';

  data.forEach(rowData => {
    const rowEl = document.createElement('DIV');
    rowEl.style = 'display: flex';

    rowData.forEach(cellData => {
      const checkboxEl = document.createElement('input');
      checkboxEl.type = 'checkbox';
      checkboxEl.style = 'margin: 0';
      rowEl.appendChild(checkboxEl);
    });

    displayEl.appendChild(rowEl);
  });
}
