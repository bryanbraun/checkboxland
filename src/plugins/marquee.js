let intervalId;

function marquee(newData, options = {}) {
  const { interval = 200, repeat = false, fillValue = 0, callback = () => {} } = options;

  const numberOfRows = this.dimensions[1];
  const numberOfColumns = this.dimensions[0];
  const totalIterations = numberOfColumns + newData[0].length ;

  let currentIteration = 1;

  intervalId = setInterval(() => {
    const currentData = this.getData();

    for (let y = 0; y < numberOfRows; y++) {
      for (let x = 0; x < numberOfColumns; x++) {
        const finalColumn = (x + 1 === numberOfColumns);

        // We only draw fresh checkboxes on the final column of the grid.
        // All other values simply get shifted to the left.
        if (finalColumn) {
          // Pull the value from newData. If this location in newData is undefined,
          // we assign a fillValue to fill the space until the animation is complete.
          const sourceColumnToDraw = currentIteration - (numberOfColumns - x);
          const newDataValue = (!newData[y]) ? fillValue :
                               (typeof newData[y][sourceColumnToDraw] === 'undefined') ? fillValue :
                               newData[y][sourceColumnToDraw];

          this.setCheckboxValue(x, y, newDataValue);
        } else {
          // Shift an existing value to the left.
          this.setCheckboxValue(x, y, currentData[y][x + 1]);
        }
      };
    };

    if (currentIteration === totalIterations) {
      if (repeat) {
        currentIteration = 1;
      } else {
        clearInterval(intervalId);
        callback();
      }
    } else {
      currentIteration++;
    }
  }, interval);
}

function cleanUp() {
  clearInterval(intervalId);
}

export default {
  name: 'marquee',
  exec: marquee,
  cleanUp: cleanUp,
}
