import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, isPlatformServer, NgOptimizedImage } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { map, tap } from 'rxjs';
import { AvatarComponent } from '../../components/avatar.component';
import { JsonLdComponent } from '../../components/json-ld.component';
import { PostInfoComponent } from '../../components/post-info.component';
import PostAttributes from '../../post-attributes';

export const routeMeta: RouteMeta = {
  meta: [
    {
      name: 'og:type',
      content: 'article',
    },
    {
      name: 'Author',
      content: 'Abel de la Fuente',
    },
  ],
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonLdComponent,
    AvatarComponent,
    NgOptimizedImage,
    MarkdownComponent,
    PostInfoComponent,
  ],
  template: `
    @if (post$ | async; as post) {
      <!-- JSON LD SCHEMA -->
      <afb-json-ld [json]="schema()" />

      <!-- ARTICLE -->
      <article class="pb-8">
        <h1 class="py-0">{{ post.attributes.title }}</h1>

        <!-- POST INFO -->
        <div class="flex gap-3 py-4 items-center">
          <afb-avatar />
          <afb-post-info
            [readingTime]="readingTime()"
            [date]="post.attributes.date"
          />
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
          class="text-xs block"
        ></small>

        <!-- CONTENT -->
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
  private readonly platformId = inject(PLATFORM_ID);

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
    }),
  );

  protected readonly readingTime = toSignal(
    this.post$.pipe(
      map(({ content }) => Math.round((content?.length || 0) / 100 / 4)),
    ),
  );

  protected schema = toSignal(
    this.post$.pipe(
      map(({ attributes }) => this.generateJsonLdSchema(attributes)),
    ),
    { initialValue: {} },
  );

  comments = viewChild<ElementRef>('comments');

  addCommentsEffect = effect(() => {
    const comments = this.comments();
    if (!comments?.nativeElement || isPlatformServer(this.platformId)) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'abelfubu/blog');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    comments.nativeElement.appendChild(script);
  });

  private generateJsonLdSchema(
    attributes: Partial<PostAttributes>,
  ): Record<string, unknown> {
    return {
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
      headline: attributes.title,
      image: attributes.coverImage,
      datePublished: attributes.date,
      dateModified: attributes.date,
    };
  }
}
