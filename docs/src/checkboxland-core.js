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
  displayEl.style.add('checkboxland');

  _addBaselineStyles();

  data.forEach(rowData => {
    const rowEl = document.createElement('div');
    rowEl.classList.add('checkboxland-row');

    rowData.forEach(cellData => {
      const checkboxEl = document.createElement('input');
      checkboxEl.classList.add('checkboxland-checkbox');
      checkboxEl.type = 'checkbox';
      rowEl.appendChild(checkboxEl);
    });

    displayEl.appendChild(rowEl);
  });
}

function _addBaselineStyles() {
  // We don't want to add global baseline styles if they've been added before.
  if (document.head.querySelector('style.checkboxland-styles') !== null) {
    return;
  }

  const style = document.createElement('style');
  const displayRule = `
    .checkboxland {
      overflow: scroll;
    }`;
  const rowRule = `
    .checkboxland-row {
      line-height: 0.75;
    }`;
  const checkboxRule = `
    .checkboxland-checkbox {
      margin: 0;
    }`;

  style.className = 'checkboxland-styles';
  style.appendChild(document.createTextNode('')); // Necessary for Webkit.

  // We place it in the head with the other style tags, if possible, so as to
  // not look out of place. We insert before the others so these styles can be
  // overridden if necessary.
  const firstStyleEl = document.head.querySelector('[rel="stylesheet"], style');
  if (firstStyleEl === undefined) {
    document.head.appendChild(style);
  } else {
    document.head.insertBefore(style, firstStyleEl);
  }

  style.sheet.insertRule(displayRule, style.sheet.cssRules.length);
  style.sheet.insertRule(rowRule, style.sheet.cssRules.length);
  style.sheet.insertRule(checkboxRule, style.sheet.cssRules.length);
}
