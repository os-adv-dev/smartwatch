import { WebPlugin } from '@capacitor/core';

import type { SmartwatchApplicationPlugin } from './definitions';

export class SmartwatchApplicationWeb extends WebPlugin implements SmartwatchApplicationPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
