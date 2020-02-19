export function marquee(newData, options = {}) {
  const { interval = 500, repeat = false, callback = () => {} } = options;

  const rowLength = this.dimensions[0];
  const columnHeight = this.dimensions[0];
  const totalIterations = rowLength + newData[0].length ;

  let currentIteration = 1;

  const intervalId = setInterval(() => {
    let currentData = this.getData();

    currentData.forEach((rowData, rowIndex) => {
      if (!newData[rowIndex]) return;

      rowData.forEach((cellValue, cellIndex) => {
        const isLastCheckboxInRow = (cellIndex + 1 === rowLength);

        if (isLastCheckboxInRow) {
          // Pull the value from newData. If this location in newData is undefined (aka, we've run out
          // of data) we assign 0 (an empty checkbox) to fill the space until the animation is complete.
          let newDataValue = newData[rowIndex][currentIteration - (rowLength - cellIndex)] || 0;

          this.setCheckboxValue(cellIndex, rowIndex, newDataValue);
        } else {
          // Shift an existing value to the left.
          this.setCheckboxValue(cellIndex, rowIndex, currentData[rowIndex][cellIndex + 1]);
        }
      });
    });

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
