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

    this.data.forEach((rowData, rowIndex) => {
      const rowEl = this.displayEl.children[rowIndex];

      if (!rowEl) return;

      rowData.forEach((cellData, cellIndex) => {
        const checkboxEl = rowEl.children[cellIndex];

        if (!checkboxEl) return;

        const isCellChecked = Boolean(cellData);

        if (isCellChecked === checkboxEl.checked) return;

        checkboxEl.checked = isCellChecked;
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
  displayEl.style.overflowX = 'auto';
  displayEl.style.padding = '1px';

  data.forEach(rowData => {
    const rowEl = document.createElement('div');
    rowEl.style.lineHeight = 0.75;
    rowEl.style.whiteSpace = 'nowrap';

    rowData.forEach(cellData => {
      const checkboxEl = document.createElement('input');
      checkboxEl.style.margin = 0;
      checkboxEl.type = 'checkbox';
      rowEl.appendChild(checkboxEl);
    });

    displayEl.appendChild(rowEl);
  });
}
