import { Component } from '@angular/core';

@Component({
  selector: 'afb-social-media',
  standalone: true,
  template: `
    <ul class="flex list-none items-center">
      <li class="ml-4 text-[var(--primary)]">
        <a href="https://mastodon.social/@abelfubu" target="_blank">
          <i class="fa-brands fa-mastodon"></i>
          <span class="hidden">Mastodon</span>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a href="https://github.com/abelfubu" target="_blank">
          <i class="fa-brands fa-square-github"></i>
          <span class="hidden">Github</span>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a href="https://linkedin.com/in/abelfubu" target="_blank">
          <i class="fa-brands fa-linkedin"></i>
          <span class="hidden">Linkedin</span>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a href="https://twitter.com/abelfubu" target="_blank">
          <i class="fa-brands fa-square-x-twitter"></i>
          <span class="hidden">Twitter</span>
        </a>
      </li>
    </ul>
  `,
})
export default class SocialMediaComponent {}
