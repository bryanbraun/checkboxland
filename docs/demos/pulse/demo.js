import { Checkboxland } from '../../../src/index.js';

// Config
let cbl;
const width = 44;
const height = 15;
const interval = 16;
const dimensions = `${width}x${height}`;

let intervalIds = [];

// Init Loop
function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  cbl.print('click me', { x: 2, y: 4, fillValue: 0 });
  cbl.onClick(pulse);

  return cbl;
}

function cleanUp() {
  cbl.onClick.cleanUp();
  intervalIds = intervalIds.forEach(intervalId => clearInterval(intervalId));
  intervalIds = [];
}

function pulse({ x, y }) {
  let originX = x;
  let originY = y;

  // This matrix manages pulse state, which is different from checkbox state.
  //   Unaffected:   'Ω'
  //   Affected:     '@'
  const pulseStateMatrix = cbl.getEmptyMatrix({ fillValue: 'Ω' });
  const startTime = performance.now();

  const intervalId = setInterval(function propagateCircle() {
    let is_Ω_Found = false;
    let elapsedTime = performance.now() - startTime;

    for (let matY = 0; matY < pulseStateMatrix.length; matY++) {
      for (let matX = 0; matX < pulseStateMatrix[matY].length; matX++) {
        let xDistanceToOrigin = Math.abs(originX - matX);
        let yDistanceToOrigin = Math.abs(originY - matY);
        let distanceToOrigin = Math.hypot(xDistanceToOrigin, yDistanceToOrigin);

        // Our mathematical distance comparison function.
        // See: https://www.desmos.com/calculator/ptbmix9qi0
        let calculatedPulseState = distanceToOrigin > (elapsedTime / 100) ? 'Ω' : '@';

        // Determine if this checkbox is on the leading edge and should be toggled.
        if (pulseStateMatrix[matY][matX] !== calculatedPulseState) {
          let currentCheckboxValue = cbl.getCheckboxValue(matX, matY);
          let newCheckboxValue = currentCheckboxValue === 0 ? 1 : 0;
          cbl.setCheckboxValue(matX, matY, newCheckboxValue); // toggle checkbox
          pulseStateMatrix[matY][matX] = calculatedPulseState;
        }

        // Record if any unaffected checkboxes remain.
        if (!is_Ω_Found && pulseStateMatrix[matY][matX] === 'Ω') {
          is_Ω_Found = true;
        }
      }
    }

    // If no Ω's remain, the propagation has completed and the interval can be cleared.
    if (!is_Ω_Found) {
      const intervalIdIndex = intervalIds.indexOf(intervalId);
      clearInterval(intervalIds[intervalIdIndex]);
      intervalIds.splice(intervalIdIndex, 1);
    }
  }, interval)

  intervalIds.push(intervalId);
}

export {
  init,
  cleanUp,
  dimensions,
}

