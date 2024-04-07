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
import { tap } from 'rxjs';
import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, DatePipe],
  template: `
    @if (post$ | async; as post) {
      <article class="pb-8">
        <h1 class="py-0">{{ post.attributes.title }}</h1>
        <span class="block"
          >{{ post.attributes.date | date: 'longDate' }} | Abel de la
          Fuente</span
        >
        <small [innerHTML]="post.attributes.imageShoutout"></small>
        <img class="post__image pb-8" [src]="post.attributes.coverImage" />
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
