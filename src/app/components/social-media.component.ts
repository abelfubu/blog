import { Component } from '@angular/core';

@Component({
  selector: 'afb-social-media',
  standalone: true,
  template: `
    <ul class="flex list-none items-center">
      <li class="ml-4 text-[var(--primary)]">
        <a
          href="https://mastodon.social/@abelfubu"
          target="_blank"
          aria-label="Link to mastodon profile"
        >
          <i class="fa-brands fa-mastodon"></i>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a
          href="https://github.com/abelfubu"
          target="_blank"
          aria-label="Link to github profile"
        >
          <i class="fa-brands fa-square-github"></i>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a
          href="https://linkedin.com/in/abelfubu"
          target="_blank"
          aria-label="Link to linkedin profile"
        >
          <i class="fa-brands fa-linkedin"></i>
        </a>
      </li>
      <li class="ml-4 text-[var(--primary)]">
        <a
          href="https://twitter.com/abelfubu"
          target="_blank"
          aria-label="Link to twitter profile"
        >
          <i class="fa-brands fa-square-x-twitter"></i>
        </a>
      </li>
    </ul>
  `,
})
export default class SocialMediaComponent {}
