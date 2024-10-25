import { registerPlugin } from '@capacitor/core';

import type { SmartwatchApplicationPlugin } from './definitions';

const SmartwatchApplication = registerPlugin<SmartwatchApplicationPlugin>('SmartwatchApplication', {
  web: () => import('./web').then((m) => new m.SmartwatchApplicationWeb()),
});

export * from './definitions';
export { SmartwatchApplication };
