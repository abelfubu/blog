---
title: Create a blog with analog and angular
slug: 2024-04-09-create-analog-blog
description: Creating a blog with analog and angular and discover about SEO, sitemaps, syntax highlighting code blocks and deploy your static site with render.
date: 2024-04-06
tags:
  - frontend
  - analog
  - angular
coverImage: https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1080&h=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageShoutout: Photo by <a href="https://unsplash.com/@retrosupply?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">RetroSupply</a> on <a href="https://unsplash.com/photos/vintage-teal-typewriter-beside-book-jLwVAUtLOAQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
---

## Hey, Let's Talk Blogging!

So, here's the deal: I'm all about productivity hacks, from DIY keyboards to tinkering with Vim, building a knowledge management system with obsidian.md and devouring productivity books like "Atomic Habits." But you know what's been on my backburner forever? Starting my own blog. Then Analog 1.0 dropped, and being an Angular fan, I thought, "Why not give it a shot?"

Diving into Analog for my blogging adventure has been quite the journey. And hey, I'm here to share the scoop with you! Let's walk through the process of creating your very own blog using Analog.

## Let's Get Rolling with Analog

It's time to kick things off! Grab your favorite drink, open up your terminal, and let's dive into the world of Analog.

To get started, enter the following command:

```bash
npm create analog@latest
```

Analog will ask you a few questions. When prompted to select a variant, be sure to choose the blog variant:

```bash
√ Select a template: » Analog
? Select a variant: » - Use arrow-keys. Return to submit.
    angular-v17
>   blog
    angular-v16
```

Once you've made your selection, follow the instructions provided. Then, navigate to the newly created folder, install the necessary packages, and launch the project with:

```shell
npm run dev
```

And there you have it! If you visit the web, you'll find a simple yet elegant application ready for your personal touch.

## Front Matter Matters

Let's delve into the details of your blog's front matter. This might sound fancy, but it's crucial stuff.

First, head to the `src/content` directory. There, you'll discover your very first blog post, stored in markdown format.

Open it up, and you'll see some front matter data containing essential information about your post:

```yaml
title: My First Post
slug: 2022-12-27-my-first-post
description: My First Post Description
coverImage: https://images.unsplash.com/photo...
```

Here's the exciting part: you can customize this front matter to your heart's content. If you want to add more details, simply modify the interface in the `src/post-attributes.ts` file:

```typescript
export default interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  // Add more attributes here if you want!
}
```

Easy peasy, right? Your blog, your rules.

## Search Engine Optimization SEO

Now, let's ensure your blog gets noticed by search engines. In the `src/app/pages/blog/[slug].page.ts` file, you'll find the key to optimizing your pages for search results.

Utilize the post$ observable to update important SEO elements like title and meta tags:

```typescript
import { Meta, Title } from '@angular/platform-browser';

@Component(...)
export default class BlogPostComponent {
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
}
```

With these changes, your blog posts will stand out in search engine results.

## Sitemaps

Help search engines discover and index your content by implementing a `sitemap.xml` file. Analog and Vite make this process effortless.

Update your `vite.config.ts` file with the following snippet:

```javascript
import { defineConfig } from "vite";
import analog from "@analogjs/platform";

export default defineConfig(({ mode }) => ({
  plugins: [
    analog({
      prerender: {
        routes: async () => ["/", "/blog"], // Add more routes here if needed
        sitemap: {
          host: "https://yourdomain.com/", // Don't forget to update your domain!
        },
      },
    }),
  ],
}));
```

Now, Analog will automatically generate your `sitemap.xml` file, ensuring your blog stays visible to search engines.

## Syntax highlighting

Display your code snippets with style using Prism.js. It's already set up and ready to go in the template variant.

```json
// package.json
"prismjs": "^1.29.0",
```

To enhance your code's appearance, add Prism.js styles to your `styles.scss` file:

```scss
@import "prismjs/themes/prism-okaidia.min.css";
```

Now, any code you include in your markdown files will be beautifully highlighted.

So, go ahead and sprinkle some code into your markdown files like so:

````markdown
```typescript
function hello(name: string): void {
  console.log(name);
}
```
````

Watch as your code comes to life in vibrant colors!

## Comments

Encourage engagement by enabling comments on your blog posts. With [Utterances](https://utteranc.es/), this process is straightforward.

Head to the Utterances website, set up the widget for your GitHub account, and choose a repository and theme.

Next, add the following code to your blog post component under `src/app/pages/blog/[slug].page.ts`:

```html
<div #comments></div>
```

In the component we can take advantage of the new query signal API

```typescript
comments = viewChild<ElementRef>("comments");

addCommentsEffect = effect(() => {
  if (!this.comments()?.nativeElement) return;

  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.setAttribute("repo", "username/repo");
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("theme", "dark-blue");
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;
  this.comments()?.nativeElement.appendChild(script);
});
```

Now, readers can share their thoughts directly on your blog posts.

## Deploy your static site

Ready to share your blog with the world? Analog makes deploying your site a breeze.

Update your `vite.config.ts` file to ensure your posts are generated automatically:

```javascript
...
  plugins: [
    analog({
      prerender: {
        routes: async () => [
          '/blog',
          {
            contentDir: 'src/content',
            transform: (file: PrerenderContentFile) => {
              // do not include files marked as draft in frontmatter
              if (file.attributes['draft']) {
                return false;
              }
              // use the slug from frontmatter if defined, otherwise use the files basename
              const slug = file.attributes['slug'] || file.name;
              return `/blog/${slug}`;
            },
          },
        ],
        sitemap: {
          host: 'https://yourdomain.com/',
        },
      },
    }),
...
```

And just like that, your blog posts will be set up and ready whenever you hit the build button.

Now, let's showcase your blog to the world!

It's time to take your blog live and share your work with the world! Thanks to Analog, deploying your site is straightforward. Whether you're opting for a static generated site or SSR (Server-Side Rendering), Analog provides the tools you need.

Head over to the Analog docs and explore the deployment section. It offers various options to suit your needs: [Analog Deployment Docs](https://analogjs.org/docs/features/deployment/providers).

Let me share a popular choice: [Render](https://render.com/). It's user-friendly and efficient. Just visit their website, create an account (if you haven't already), and you'll be ready to deploy your site.

1. Create a new Static Site and select the repository that contains your code.

2. Depending on your package manager, set the build command to yarn && yarn build, npm install && npm run build, or pnpm i --shamefully-hoist && pnpm build..

3. Set the publish directory to the public directory inside of the dist build directory (e.g. dist/analog/public)

Click 'Create Static Site'

DONE!

## Conclusion

Congratulations on publishing your inaugural blog post! This marks the beginning of your blogging journey, and it's an exciting milestone to celebrate.

As you navigate this new endeavor, remember that every blogger starts somewhere, and there's always room to grow and learn along the way. Embrace the process, enjoy the journey, and don't be afraid to share your experiences, thoughts, and insights with your readers.

Your blog is a space for exploration, self-expression, and connection. So, keep writing, keep experimenting, and most importantly, keep being yourself.

Here's to the start of something special. Happy blogging!
