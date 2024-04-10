import { injectContentFiles } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostCardComponent from '../../components/post-card.component';
import PostAttributes from '../../post-attributes';
import { normalize } from '../../utils/string.utils';

export const routeMeta: RouteMeta = {
  title: 'Abelfubu Blog',
  meta: [
    {
      name: 'description',
      content: 'Abelfubu Blog',
    },
    {
      name: 'og:description',
      content:
        'My personal blog where I write about my thoughts and experiences specially about programming and coding.',
    },
    {
      name: 'og:title',
      content: 'Abelfubu Blog',
    },
  ],
};

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, PostCardComponent, JsonPipe],
  template: `
    <input
      #searchBox
      type="text"
      placeholder="Search..."
      class="p-2 rounded bg-black w-full outline-1 focus:outline-[var(--primary)] focus:outline"
      (keyup)="filter.set(searchBox.value)"
    />
    <h1>Blog Archive</h1>
    <div class="flex flex-col gap-8">
      @for (post of posts(); track post.attributes.slug) {
        <afb-post-card [post]="post.attributes" />
      }
    </div>
  `,
})
export default class HomeComponent {
  private readonly _posts = signal(injectContentFiles<PostAttributes>());
  protected readonly filter = signal<string>('');

  protected readonly posts = computed(() =>
    this._posts().filter((post) => {
      const joined = `${post.attributes.title} ${post.attributes.description} ${post.attributes.tags.join(' ')}`;
      return normalize(joined).includes(normalize(this.filter()));
    }),
  );
}
