import { Checkboxland } from './checkboxland-core.js';
import { print } from './plugins/print/print.js';
import { marquee } from './plugins/marquee.js';
import { transitionWipe } from './plugins/transitionWipe.js';
import { dataUtils } from './plugins/dataUtils.js';

// Add built-in plugins
Checkboxland.extend(print);
Checkboxland.extend(marquee);
Checkboxland.extend(transitionWipe);
Checkboxland.extend(dataUtils);

export { Checkboxland }
