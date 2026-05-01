// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import yeskunallumami from '@yeskunall/astro-umami';

// https://astro.build/config
export default defineConfig({
  site: 'https://shalegame.github.io',
  integrations: [preact(), yeskunallumami({ id: '6dd6e1c2-6bb4-47f0-89c3-3d760aabc60c' })],
  server: {
    headers: {
      'Content-Security-Policy': 'script-src \'self\' https://cloud.umami.is;'
    }
  }
});