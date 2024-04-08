import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'afb-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="flex justify-between items-center py-4 md:py-8">
      <img
        src="./images/abelfubu.svg"
        alt="Abelfubu logo"
        class="w-24 cursor-pointer"
        [routerLink]="['/']"
      />
      <nav>
        <ul class="flex list-none items-center">
          @for (link of links; track link.id) {
            <li class="ml-4">
              <a
                class="no-underline weight font-bold"
                [routerLink]="link.url"
                routerLinkActive="text-[var(--primary)]"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                {{ link.text }}
              </a>
            </li>
          }
          <li class="ml-4 text-[var(--primary)]">
            <a href="https://mastodon.social/@abelfubu" target="_blank">
              <i class="fa-brands fa-mastodon"></i>
            </a>
          </li>
          <li class="ml-4 text-[var(--primary)]">
            <a href="https://github.com/abelfubu" target="_blank">
              <i class="fa-brands fa-square-github"></i>
            </a>
          </li>
          <li class="ml-4 text-[var(--primary)]">
            <a href="https://linkedin.com/in/abelfubu" target="_blank">
              <i class="fa-brands fa-linkedin"></i>
            </a>
          </li>
          <li class="ml-4 text-[var(--primary)]">
            <a href="https://twitter.com/abelfubu" target="_blank"
              ><i class="fa-brands fa-square-x-twitter"></i
            ></a>
          </li>
        </ul>
      </nav>
    </header>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  protected readonly links = [
    // { id: 1, text: 'Home', url: '' },
    { id: 2, text: 'Blog', url: '/blog' },
  ];
}
