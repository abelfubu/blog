import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { map, tap } from 'rxjs';
import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, DatePipe],
  template: `
    @if (post$ | async; as post) {
      <article class="pb-8">
        <h1 class="py-0">{{ post.attributes.title }}</h1>
        <div class="flex gap-3 py-4 items-center">
          <img
            class="w-8 h-8 rounded-full"
            src="https://avatars.githubusercontent.com/u/65258220?v=4"
          />

          <div>
            <small class="block mb-[-8px]">Abel de la Fuente </small>

            <small
              >{{ post.readingTime }} min read -
              <span class="text-[var(--primary)] py-0">{{
                post.attributes.date | date: 'longDate'
              }}</span>
            </small>
          </div>
        </div>

        <img class="post__image" [src]="post.attributes.coverImage" />
        <small
          [innerHTML]="post.attributes.imageShoutout"
          class="text-xs block pb-4"
        ></small>
        <analog-markdown [content]="post.content" />
      </article>

      <section class="pb-16 min-h-48">
        @defer (on viewport; prefetch on idle) {
          <div #comments></div>
        } @placeholder {
          <div class="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
            <!-- Header -->
            <div class="w-2/3 h-4 bg-gray-600 rounded mb-2"></div>
            <!-- Body -->
            <div class="w-full h-8 bg-gray-600 rounded mb-2"></div>
            <div class="w-full h-8 bg-gray-600 rounded mb-2"></div>
            <div class="w-1/2 h-8 bg-gray-600 rounded"></div>
          </div>
        }
      </section>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .post__image {
        max-height: 40vh;
        border-radius: 0.5rem;
      }

      .utterances {
        max-width: unset;
      }

      small a {
        color: var(--primary);
      }
    `,
  ],
})
export default class HomeComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  readonly post$ = injectContent<PostAttributes>().pipe(
    tap(({ attributes: { title, description, coverImage } }) => {
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ name: 'og:description', content: description });
      this.meta.updateTag({ name: 'og:image', content: coverImage });
      this.meta.updateTag({ name: 'og:title', content: title });
    }),
    map((post) => ({
      ...post,
      readingTime: Math.round((post.content?.length || 0) / 100 / 4),
    })),
  );

  comments = viewChild<ElementRef>('comments');

  addCommentsEffect = effect(() => {
    if (!this.comments()?.nativeElement) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'abelfubu/blog');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    this.comments()?.nativeElement.appendChild(script);
  });
}
