import { injectContentFiles } from '@analogjs/content';
import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostCardComponent from '../../components/post-card.component';
import PostAttributes from '../../post-attributes';

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

// normalizes a string by removing all non-alphanumeric characters and accents and converting to lowercase
function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}
