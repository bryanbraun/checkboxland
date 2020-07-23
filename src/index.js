import { Checkboxland } from './checkboxland.js';
import print from './plugins/print/print.js';
import marquee from './plugins/marquee.js';
import transitionWipe from './plugins/transitionWipe.js';
import dataUtils from './plugins/dataUtils.js';
import onClick from './plugins/onClick.js';

// Add built-in plugins
Checkboxland.extend(print);
Checkboxland.extend(marquee);
Checkboxland.extend(transitionWipe);
Checkboxland.extend(dataUtils);
Checkboxland.extend(onClick);

export { Checkboxland }
