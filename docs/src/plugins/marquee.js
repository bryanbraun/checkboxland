export function marquee(newData, options = {}) {
  const { interval = 500, repeat = false, callback = () => {} } = options;

  const originalData = this.getData();
  const originalDataLength = originalData[0].length;
  const totalIterations = originalDataLength + newData[0].length ;

  let currentIteration = 1;

  const intervalId = setInterval(() => {
    if (currentIteration === totalIterations) {
      if (!repeat) {
        clearInterval(intervalId);
      } else {
        currentIteration = 1;
      }
    }

    originalData.forEach((rowData, rowIndex) => {
      if (!newData[rowIndex]) return;

      rowData.forEach((cellValue, cellIndex) => {
        let leadingEdgeIndex = (originalDataLength - currentIteration)
        console.log(`leadingEdgeIndex: ${leadingEdgeIndex}`);

        // Skip changes to any cells that are before the leading edge
        if (cellIndex < leadingEdgeIndex) {
          console.log(`skipping cell: ${cellIndex}`);
          return;
        }

        // Useful for debugging
        // console.log(`setting (${cellIndex},${rowIndex}) to newData's (${currentIteration - (originalDataLength - cellIndex)},${rowIndex})`);

        // If this location in newData is undefined, we've run out of data. Thus we can set
        // empty checkboxes (0) to fill up space until the marquee animation is complete.
        let newDataValue = newData[rowIndex][currentIteration - (originalDataLength - cellIndex)] || 0;

        this.setCheckboxValue(cellIndex, rowIndex, newDataValue);
        // todo: should we shift everything off screen instead of just overwriting it?
      });
    });

    // Useful for debugging
    // console.log(`Iteration ${currentIteration} of ${totalIterations}`);

    currentIteration++;
  }, interval);

  // Overwrite the empty display with our data, one column at a time, starting

}
