---
title: Create a blog with analog
slug: 2024-04-09-create-analog-blog
description: Creating a blog with analog and discover about SEO, sitemaps, syntax highlighting code blocks and deploy your static site with render.
date: 2024-04-06
tags:
  - frontend
  - analog
  - angular
coverImage: https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1080&h=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageShoutout: Photo by <a href="https://unsplash.com/@retrosupply?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">RetroSupply</a> on <a href="https://unsplash.com/photos/vintage-teal-typewriter-beside-book-jLwVAUtLOAQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
---

### Hey, Let's Talk Blogging!

So, here's the deal: I'm all about productivity hacks, from DIY keyboards to tinkering with Vim, building a knowledge management system with obsidian.md and devouring productivity books like "Atomic Habits." But you know what's been on my backburner forever? Starting my own blog. Then Analog 1.0 dropped, and being an Angular fan, I thought, "Why not give it a shot?"

Diving into Analog for my blogging adventure has been quite the journey. And hey, I'm here to share the scoop with you! Let's walk through the process of creating your very own blog using Analog.

### Let's Get Rolling with Analog

Alrighty, time to dive in! Grab your favorite beverage, fire up your terminal, and let's get this Analog party started.

First off, type this magic incantation:

```bash
npm create analog@latest
```

Now, Analog's gonna ask you a few questions. When it prompts you to select a variant, make sure to choose the blog variant like a champ:

```bash
√ Select a template: » Analog
? Select a variant: » - Use arrow-keys. Return to submit.
    angular-v17
>   blog
    angular-v16
```

Once you've made your choice, follow the instructions it gives you. Then, hop into the newly created folder, install those packages, and hit this command to fire up the project:

```shell
npm run dev
```

And voilà! If you navigate to the web, you'll see a basic but beautiful application just waiting for your personal touch.

### Front Matter Matters

Alright, time to get down to the nitty-gritty of your blog's front matter. This stuff might sound fancy, but trust me, it's super important.

So, first things first, head on over to the src/content directory. There, you'll find your very first blog post, chilling in markdown format.

Open it up, and you'll see some front matter data (or meta data, if you wanna get fancy) for your post. It's like the backstage pass to your blog, holding all the key info:

```yaml
title: My First Post
slug: 2022-12-27-my-first-post
description: My First Post Description
coverImage: https://images.unsplash.com/photo...
```

Now, here's the cool part. You can customize this front matter to your heart's content. Want to add more info? Go for it! Just dive into the src/post-attributes.ts file, and tweak the interface to fit your needs:

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

### Search Engine Optimization SEO

Alright, let's talk about getting your blog noticed by the big guns of the internet: search engines.

So, you've got this file called src/app/pages/blog/[slug].page.ts. It's like the secret sauce behind your blog's pages. Open it up, and you'll find a simple component doing its thing.

But here's the deal: if you want your blog to shine in the search results, you gotta give it some love. That's where SEO comes in.

Now, don't worry, it's not as scary as it sounds. With Analog and Angular, you've got some handy tools at your disposal.

In that blog/[slug].page.ts file, you'll notice a nifty little observable called post$. It's like your blog's best friend, holding all the juicy details about your post.

But wait, there's more! You can use this buddy to update all the important SEO stuff, like the title and meta tags. Just inject some Angular magic:

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

Boom! With a few lines of code, you're telling those search engines, "Hey, check out my awesome blog post!"

### Sitemaps

So, here's the deal: we want search engines to easily find and index all the awesome content you're creating. And one way to help them out is by having a sitemap.xml file that lists all the URLs of your blog posts.

Now, lucky for us, Analog and Vite make this process a breeze. Check out this snippet you can add to your vite.config.js file:

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

With this setup, Analog will automatically generate your sitemap.xml file whenever you add new posts or make changes to your blog. How cool is that?

So go ahead, update your vite.config.js file, kick back, and let Analog do the heavy lifting for you. Your blog's SEO game just got a major boost!

Ready to dive back into the blog-building fun? Let's keep the momentum going!

### Syntax highlighting

Listen up, fellow coders! We know you're itching to showcase your code chops, and guess what? We've got your back.

First things first, we've already got Prism.js set up and ready to roll in the template variant. No need to break a sweat there!

```json
// package.json
"prismjs": "^1.29.0",
```

Now, to make your code pop, simply add the following styles to your styles.scss file:

```scss
@import "prismjs/themes/prism-okaidia.min.css";
```

And that's it! Prism.js will work its magic and automatically highlight your code snippets.

So, go ahead and sprinkle some code into your markdown files like so:

````markdown
```typescript
function hello(name: string): void {
  console.log(name);
}
```
````

Watch as your code comes to life in vibrant colors, ready to dazzle your readers!

Ready to flex those coding muscles? Let's make your blog shine!

### Comments

Hey there, blogosphere explorers! Ready to invite some conversation onto your blog? Let's talk about adding comments.

Now, we all know that sharing is caring, and what better way to engage with your readers than by letting them leave their thoughts right on your posts? Enter Utterances – a nifty little comments widget built on GitHub issues.

But don't worry, setting it up is a breeze! Here's how:

Head over to the Utterances website and set up the widget for your GitHub account. Choose a repository, pick a theme, and you're good to go.

Now, here's the fun part. Add the following code snippet to your blog post component under src/app/pages/blog/[slug].page.ts:

In your template, add a div with a template variable to hold the comments:

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

And that's it! Your readers can now join the conversation right on your blog posts, thanks to Utterances.

So go ahead, spark some discussions, and let the comments flow! After all, the best conversations happen when we're all in it together.

### Deploy your static site

Alrighty, time to take your blog live and share your brilliance with the world! One of the coolest perks of using Analog is how it makes deploying a static site a breeze. Plus, you get all those sweet SEO and performance benefits too!

Now, grab your trusty vite.config.js file and let's add some magic to ensure your posts are automatically generated every time you build your project.

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

And just like that, your blog posts will be ready to rock 'n roll whenever you hit that build button. Ain't technology grand?

I know, right? It's pretty darn awesome. Now, let's get that blog of yours out there for the world to see!

Alright, time to take your blog live and share your brilliance with the world! Thanks to Analog, deploying your site is as easy as pie. Whether you're opting for a static generated site or SSR (Server-Side Rendering), Analog's got your back.

Head on over to the Analog docs and dive into the deployment section. Trust me, it's a treasure trove of options waiting to be explored: Analog Deployment Docs https://analogjs.org/docs/features/deployment/overview.

Now, let me tell you about my personal favorite: Render https://render.com/. I've used it in the past, and let me tell you, deploying on Render is like a walk in the park. Just hop on over to their website, create an account (if you haven't already), and voila! You'll find yourself in your dashboard, ready to deploy your masterpiece.

1. Create a new Static Site and select the repository that contains your code.

2. Depending on your package manager, set the build command to yarn && yarn build, npm install && npm run build, or pnpm i --shamefully-hoist && pnpm build..

3. Set the publish directory to the public directory inside of the dist build directory (e.g. dist/analog/public)

Click 'Create Static Site'

DONE!

### Conclusion

And there you have it, folks! You've just taken the first steps into the wild world of blogging with Analog. From the initial excitement of starting a new project to the satisfaction of seeing it all come together, this journey has been quite the ride.

As you continue to tweak and tinker with your blog, remember to have fun along the way. Whether you're sharing coding tips, personal stories, or just your thoughts on the latest tech trends, your blog is your space to shine.

So, keep on blogging, keep on exploring, and most importantly, keep on being you. The internet is waiting to hear what you have to say, so go ahead and make your mark!
