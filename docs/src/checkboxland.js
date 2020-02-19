import { Checkboxland } from './checkboxland-core.js';
import { print } from './plugins/print.js';
import { marquee } from './plugins/marquee.js';
import { dataUtils } from './plugins/dataUtils.js';

// Add built-in plugins
Checkboxland.extend(print);
Checkboxland.extend(marquee);
Checkboxland.extend(dataUtils);

export { Checkboxland }
