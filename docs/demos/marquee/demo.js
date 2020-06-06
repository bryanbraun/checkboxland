import { Checkboxland } from '../../../src/index.js';

let dimensions = '44x15';
let cbl;

function init(existingCbl) {
  cbl = !!existingCbl ? existingCbl : new Checkboxland({ dimensions });

  let textData = cbl.print("Checkboxland", { dataOnly: true });
  let paddedTextData = cbl.dataUtils('pad', textData, { top: 4 });

  cbl.marquee(paddedTextData, { interval: 100, repeat: true });

  return cbl;
}

function cleanUp() {
  cbl.marquee.cleanUp();
}


export {
  init,
  cleanUp,
  dimensions,
}
