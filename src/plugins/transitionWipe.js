export function transitionWipe(newData, options = {}) {
  const { interval = 120, fillValue = 0, direction = 'ltr', callback = () => {} } = options;

  const numberOfRows = this.dimensions[1];
  const numberOfColumns = this.dimensions[0];
  const totalIterations = numberOfColumns + 1;

  let currentIteration = 1;

  const intervalId = setInterval(() => {
    let leadingEdgeIndex, writingEdgeIndex;

    switch (direction) {
      case 'ltr':
        leadingEdgeIndex = currentIteration - 1;
        writingEdgeIndex = leadingEdgeIndex - 1;
        break;
      case 'rtl':
        leadingEdgeIndex = numberOfColumns - currentIteration;
        writingEdgeIndex = leadingEdgeIndex + 1;
        break;
    }

    for (let y = 0; y < numberOfRows; y++) {
      for (let x = 0; x < numberOfColumns; x++) {
        // we only need to write to locations on the leading edge, or one spot
        // behind the leading edge. The values in all other locations stay the same.
        if (x === leadingEdgeIndex) {
          this.setCheckboxValue(x, y, 1);
        } else if (x === writingEdgeIndex) {
          // Pull the value from newData. If this location in newData is undefined,
          // we assign a fillValue to fill the space until the animation is complete.
          let newDataValue = (!newData[y]) ? fillValue :
                             (typeof newData[y][x] === 'undefined') ? fillValue : newData[y][x];
          this.setCheckboxValue(x, y, newDataValue);
        }
      }
    }

    if (currentIteration === totalIterations) {
      clearInterval(intervalId);
      callback();
    } else {
      currentIteration++;
    }
  }, interval);
}
