import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'afb-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="flex justify-between items-center  py-8">
      <img src="./images/abelfubu.svg" alt="Abelfubu logo" class="w-24" />
      <nav>
        <ul class="flex list-none">
          @for (link of links; track link.id) {
            <li>
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
      </nav>
    </header>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  protected readonly links = [
    { id: 1, text: 'Home', url: '' },
    { id: 2, text: 'Blog', url: '/blog' },
  ];
}
