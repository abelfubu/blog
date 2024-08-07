---
title: Global State with Angular Signals and the Power of Dependency Injection
slug: 2024-06-01-global-state-with-angular-signals-and-the-power-of-dependency-injection
description: In Angular, signals are a great tool for state management and handling synchronous data. They aren't limited to components, we can also use them in services to manage global state.
date: 2024-06-01
tags:
  - angular
  - signals
  - DI
coverImage: https://images.unsplash.com/photo-1533743732795-82edc843f03e?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageShoutout: Photo by <a href="https://unsplash.com/@andriyko?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andriyko Podilnyk</a> on <a href="https://unsplash.com/photos/low-angle-photo-of-truss-tower-dZ301bzWqQM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
---

## Introduction

In Angular, signals are a great tool for state management and handling synchronous data. They aren't limited to components; we can also use them in services to manage global state. This article demonstrates how to leverage signals and dependency injection (DI) in Angular to create a reusable global state management system.

## Using Signals in Components

Let's start with a simple example of a counter component that uses signals to manage its state.

```angular-ts
@Component({
  selector: "app-counter",
  template: `
    <h1>Counter</h1>
    <button (click)="increment()">Increment</button>
    <p>Count: {{ count() }}</p>
    <button (click)="decrement()">Decrement</button>
  `,
})
export class CounterComponent {
  protected readonly count = signal(0);

  increment(): void {
    this.count.update((count) => count + 1);
  }

  decrement(): void {
    this.count.update((count) => count - 1);
  }
}
```

In this example, we have a simple counter with increment and decrement functionality. However, this state is local to the component. Let's move this state to a service to manage it globally.

## Moving State to an Injectable Service

We'll create a service to handle the global state of the counter.

```angular-ts
@Component({
  selector: "app-counter",
  template: `
    <h1>Counter</h1>
    <button (click)="counter.increment()">Increment</button>
    <p>Count: {{ counter.count() }}</p>
    <button (click)="counter.decrement()">Decrement</button>
  `,
})
export class CounterComponent {
  protected readonly counter = inject(Counter);
}

@Injectable({
  providedIn: "root",
})
export class Counter {
  private readonly state = signal(0);
  readonly count = computed(() => this.state());

  increment(): void {
    this.count.update((count) => count + 1);
  }

  decrement(): void {
    this.count.update((count) => count - 1);
  }
}
```

By moving the state to an injectable service, we make it reusable across different components. This is similar to custom hooks in other frameworks, allowing us to encapsulate and reuse our application logic.

## Functional Approach to State Management

If you prefer a more functional approach, you can create a function to handle the state.

```angular-ts
export function createCounter(initialValue: number): ... {
  const count = signal(initialValue);

  return {
    count: computed(() => count()),
    increment: count.update(count => count + 1),
    decrement: count.update(count => count - 1),
  }
}

@Component({
	selector: 'app-counter',
	template: `
	  <h1>Counter</h1>
	  <button (click)="counter.increment()">Increment</button>
	  <p>Count: {{ counter.count() }}</p>
	  <button (click)="counter.decrement()">Decrement</button>
	`,
})
export class CounterComponent {
  protected readonly counter = createCounter(0);
}
```

This approach works the same way but lacks the benefits of DI, such as easily mocking dependencies and decoupling our code.

## Using Injection Tokens for State Management

We can combine the functional approach with DI by creating the counter as an injection token.

```angular-ts
const injectCounter = (initialState: number) => {
  return inject(new InjectionToken('appCounter', {
    providedIn: 'root',
    factory: () => {
      const state = signal(initialState);

      return {
        count: state,
        increment: () => state.update((count) => count + 1),
        decrement: () => state.update((count) => count - 1),
      };
    },
  }));
};

@Component({...})
export class CounterComponent {
  protected readonly counter = injectCounter(0);
}
```

## Adding More Complexity with Dependency Injection

Of course, you can get creative and inject additional dependencies to create more complex state management solutions. For example, you might want to fetch the counter value from an API:

```typescript
const injectCounter = (initialState: number) => {
  const http = inject(HttpClient);

  return inject(
    new InjectionToken('appCounter', {
      providedIn: 'root',
      factory: () => {
        const state = signal(initialState);

        return {
          count: state,
          increment: () => state.update((count) => count + 1),
          decrement: () => state.update((count) => count - 1),
          getCount: () =>
            http
              .get<number>('https://counter.api.com')
              .pipe(tap((count) => state.set(count))),
        };
      },
    }),
  );
};
```

By injecting `HttpClient`, we can now fetch the initial counter value from an external API, further demonstrating the flexibility and power of combining signals with DI. Of course you can get creative here and inject some other deps to create a more complex state management

## Conclusion

Using Angular signals and DI together allows us to create flexible, reusable, and decoupled global state management solutions. Whether you prefer a class-based or functional approach, leveraging these powerful features of Angular can significantly improve your application's architecture.
