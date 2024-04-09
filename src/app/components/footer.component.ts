import { Component } from '@angular/core';
import SocialMediaComponent from './social-media.component';

@Component({
  selector: 'afb-footer',
  standalone: true,
  imports: [SocialMediaComponent],
  template: `
    <footer class="flex flex-col items-center justify-center p-8">
      <small>Abel de la Fuente © 2024</small>
      <afb-social-media />
      <small
        >Built with
        <a
          class="text-[var(--primary)]"
          href="https://analogjs.org"
          target="_blank"
          >Analog</a
        >
      </small>
    </footer>
  `,
})
export default class FooterComponent {}
