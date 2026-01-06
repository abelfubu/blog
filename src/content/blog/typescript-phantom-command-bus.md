---
title: Taming Command Bus Generics with TypeScript Phantom Types
slug: 2026-01-06-taming-command-bus-generics-with-typescript-phantom-types
description: TypeScript and CQRS don't always agree on inference. Here's how a phantom type helped me convince the compiler that my command bus really knew what result to expect.
date: 2026-01-06
tags:
  - typescript
  - cqrs
  - architecture
coverImage: https://images.unsplash.com/photo-1665994658193-757b70ffe3e2?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageShoutout: Photo by <a href="https://unsplash.com/es/@eleanorbrooke?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Eleanor Brooke</a> on <a href="https://unsplash.com/es/fotos/dos-personas-vestidas-de-blanco-en-un-bosque-F6rGrsWYivQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
---

## Revisiting the Command Bus

Command Query Responsibility Segregation (CQRS) provides a reliable structure for complex applications, yet it exposes practical challenges when combined with TypeScript's type system. During a recent refinement of a command bus, each command was designed to return a dedicated payload and the bus was expected to infer the result type automatically. The compiler did not comply.

## Desired API

The intended usage was straightforward:

```typescript
const result = await commandBus.execute(
  new CreateUserCommand({ name: "Ariel" }),
);

// result should resolve to CreateUserResult without specifying generics explicitly
```

The supporting types were already available:

```typescript
interface Command<Payload, Result> {
  readonly type: string;
  readonly payload: Payload;
}

interface CommandHandler<C extends Command<any, any>> {
  handle(command: C): Promise<CommandResult<C>>;
}

type CommandResult<C extends Command<any, any>> =
  C extends Command<any, infer R> ? R : never;
```

The missing capability was for `commandBus.execute()` to recognise that submitting a `CreateUserCommand` must yield a `CreateUserResult`.

## Where Inference Failed

Multiple iterations of type constraints, `infer` clauses, and method overloads still produced `Promise<unknown>` unless the generic parameter was provided explicitly:

```typescript
await commandBus.execute<CreateUserCommand>(/* ... */);
```

Handlers were stored in a registry as values, which caused TypeScript to sever the relationship between command and result. From the compiler's perspective, the method accepted `Command<any, any>` and offered no further insight.

## Applying a Phantom Type

The solution was to leave a value-level hint that survived inference. A phantom type adds a property that conveys type information while remaining inert at runtime.

```typescript
type Phantom<Result> = { readonly __result?: Result };

interface Command<Payload, Result> {
  readonly type: string;
  readonly payload: Payload;
  readonly phantom?: Phantom<Result>;
}
```

By introducing the optional `phantom` field, the compiler gains a concrete property carrying `Result`. The property is never populated, yet it preserves the generic binding through to the handler.

```typescript
class CommandBus {
  constructor(private readonly handlers: Map<string, CommandHandler<any>>) {}

  execute<C extends Command<any, any>>(command: C): CommandResultPromise<C> {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      throw new Error(`No handler for ${command.type}`);
    }

    return handler.handle(command);
  }
}

type CommandResultPromise<C extends Command<any, any>> =
  C extends Command<any, infer R> ? Promise<R> : never;
```

With the phantom type in place, TypeScript infers `Promise<CreateUserResult>` without additional annotations.

## Runtime and Ergonomics

Two practical considerations remained:

1. **Runtime characteristics:** The optional property exists only on the interface, so the compiled JavaScript remains unchanged and bundle size is unaffected.
2. **Developer experience:** Requiring every command to supply the phantom property can be inconvenient. A factory helper keeps the ergonomics consistent:

   ```typescript
   const defineCommand =
     <Payload, Result>() =>
     (type: string, payload: Payload): Command<Payload, Result> => ({
       type,
       payload,
     });

   const createUser = defineCommand<CreateUserInput, CreateUserResult>();

   const command = createUser("user.create", { name: "Ariel" });
   ```

   The helper ensures the phantom information is present while keeping command construction concise.

## Key Takeaways

- TypeScript preserves generic bindings when type information appears on a tangible property; phantom types deliver this link without altering runtime behaviour.
- CQRS command buses depend on accurate command-to-result mapping, and the phantom approach maintains those contracts without additional annotations.
- Developer-facing helpers can restore ergonomics after introducing type-level plumbing.

The phantom type pattern maintained the desired API while satisfying the compiler's requirements, yielding a predictable and maintainable command bus implementation.
