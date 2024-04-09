---
title: Factory Method
slug: 2024-04-07-design-patterns-factory-method
description: An explanation of the factory method with typescript examples
date: 2024-04-07
tags:
  - development
  - design-patterns
  - creational
coverImage: https://images.unsplash.com/photo-1512813759302-a44af29da3c1?q=80&w=1040&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageShoutout: Photo by <a href="https://unsplash.com/@tama66?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Peter Herrmann</a> on <a href="https://unsplash.com/photos/white-and-brown-building-interior-z6DJJZ1-1Cg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
draft: true
---

The Factory Method pattern defines an interface for creating an object but allows subclasses to alter the type of objects that will be created. It provides a way for a class to delegate the instantiation logic to its subclasses.

```typescript
// Product interface
interface Product {
  operation(): string;
}

// Concrete Product A
class ConcreteProductA implements Product {
  operation(): string {
    return "ConcreteProductA operation";
  }
}

// Concrete Product B
class ConcreteProductB implements Product {
  operation(): string {
    return "ConcreteProductB operation";
  }
}

// Creator interface
interface Creator {
  factoryMethod(): Product;
}

// Concrete Creator A
class ConcreteCreatorA implements Creator {
  factoryMethod(): Product {
    return new ConcreteProductA();
  }
}

// Concrete Creator B
class ConcreteCreatorB implements Creator {
  factoryMethod(): Product {
    return new ConcreteProductB();
  }
}

// Usage
function clientCode(creator: Creator) {
  const product = creator.factoryMethod();
  console.log(product.operation());
}

// Client code can work with any concrete creator subclass
clientCode(new ConcreteCreatorA()); // Output: ConcreteProductA operation
clientCode(new ConcreteCreatorB()); // Output: ConcreteProductB operation
```

Explanation:

- We have a `Product` interface that defines the operations that all products must implement.
- Concrete product classes (`ConcreteProductA` and `ConcreteProductB`) implement the `Product` interface.
- We have a `Creator` interface that declares the factory method, which returns a `Product` object.
- Concrete creator classes (`ConcreteCreatorA` and `ConcreteCreatorB`) implement the `Creator` interface and provide implementations for the factory method to create specific types of products.
- The client code can work with any concrete creator subclass, allowing flexibility in object creation.

This pattern allows you to decouple the client code from the concrete classes it uses, making it easier to extend and maintain your codebase.
