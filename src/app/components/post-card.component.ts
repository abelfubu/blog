import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../post-attributes';

@Component({
  selector: 'afb-post-card',
  standalone: true,
  imports: [RouterLink, DatePipe, NgOptimizedImage],
  template: `
    @if (post(); as post) {
      <div
        class="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-xl border border-gray-900"
      >
        <img
          width="520"
          priority
          height="360"
          class="w-full md:w-6/12 "
          [ngSrc]="post.coverImage"
          [alt]="post.title"
        />

        <div class="px-5 pt-5 grow flex flex-col backdrop-blur">
          <a [routerLink]="['/blog/', post.slug]" class="grow">
            <span class="text-4xl block">{{ post.title }}</span>

            <span>{{ post.date | date: 'longDate' }}</span>
            <p class="post__desc">{{ post.description }}</p>
          </a>
          <div class="flex flex-wrap gap-2 pb-3">
            @for (tag of post.tags; track tag) {
              <div class="text-sm uppercase px-1 py-0.5">
                <strong class="text-xs text-[var(--primary)]">{{ tag }}</strong>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      img {
        aspect-ratio: 16 / 11;
      }
    `,
  ],
})
export default class PostCardComponent {
  post = input.required<PostAttributes>();
}
