import { bootstrapApplication } from '@angular/platform-browser';
import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'zone.js';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
