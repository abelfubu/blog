import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import SocialMediaComponent from './social-media.component';

@Component({
  selector: 'afb-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SocialMediaComponent],
  template: `
    <header class="flex justify-between items-center py-4 md:py-8">
      <img
        src="./images/abelfubu.svg"
        alt="Abelfubu logo"
        class="w-24 cursor-pointer"
        height="48"
        width="48"
        [routerLink]="['/']"
      />
      <nav class="flex">
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
        </ul>
        <afb-social-media />
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
