import 'prismjs';
import 'zone.js/node';
// import 'prismjs/plugins/toolbar/prism-toolbar.js';
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-yaml.js';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

export function bootstrap() {
  return bootstrapApplication(AppComponent, config);
}

export default async function render(url: string, document: string) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
  });

  return html;
}
