import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { map, tap } from 'rxjs';
import { JsonLdComponent } from '../../components/json-ld.component';
import PostAttributes from '../../post-attributes';

export const routeMeta: RouteMeta = {
  meta: [
    {
      name: 'og:type',
      content: 'article',
    },
  ],
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    AsyncPipe,
    MarkdownComponent,
    DatePipe,
    NgOptimizedImage,
    JsonLdComponent,
  ],
  template: `
    @if (post$ | async; as post) {
      <afb-json-ld [json]="schema()" />
      <article class="pb-8">
        <h1 class="py-0">{{ post.attributes.title }}</h1>
        <div class="flex gap-3 py-4 items-center">
          <img
            class="w-8 h-8 rounded-full"
            ngSrc="https://avatars.githubusercontent.com/u/65258220?v=4"
            height="32"
            width="32"
            alt="Abel de la Fuente"
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

        <img
          class="post__image"
          [ngSrc]="post.attributes.coverImage"
          [alt]="post.attributes.title"
          width="620"
          height="360"
        />
        <small
          [innerHTML]="post.attributes.imageShoutout"
          class="text-xs block pb-4"
        ></small>
        <analog-markdown [content]="post.content" />
      </article>

      <section class="pb-16 min-h-48">
        <div #comments></div>
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
export default class PostComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  protected schema = signal<Record<string, unknown>>({});

  readonly post$ = injectContent<PostAttributes>().pipe(
    tap(({ attributes: { title, description, coverImage, slug, date } }) => {
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ name: 'og:description', content: description });
      this.meta.updateTag({ name: 'og:image', content: coverImage });
      this.meta.updateTag({ name: 'og:title', content: title });
      this.meta.updateTag({
        name: 'og:url',
        content: `https://abelfubu.dev/blog/${slug}`,
      });
      this.schema.set({
        '@context': 'http://schema.org/',
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: 'Abel de la Fuente',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Abelfubu',
          logo: {
            '@type': 'ImageObject',
            url: 'https://abelfubu.dev/images/abelfubu-round.svg',
          },
        },
        headline: title,
        image: coverImage,
        datePublished: date,
        dateModified: date,
      });
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
