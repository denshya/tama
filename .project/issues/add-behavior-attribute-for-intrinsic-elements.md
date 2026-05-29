---
id: 42
assignee: Harshit9026
milestone: Quality Of Life
labels: jsx
~github: pinely-international/tama#96
---

It happens so a component, once written as a simple container with sample data, needs further implementation, which requires refactoring layout.

```tsx
function Component() {
  return (
    <div className="container">
      <Icon />
      <div className="block">
        <Slider />
      </div>
    </div>
  )
}
```

The `behavior` attribute would save time and provide component-like interfaces directly on intrinsic elements (like `div`).

```tsx
function Component() {
  return (
    <div className="container" behavior={{ context: new Context, fallbacks: { pending: <Loader /> } }}>
      <Icon />
      <div className="block">
        <Slider />
        <ContextScopedComponent />
      </div>
    </div>
  )
}
```

Essentially, `behavior` creates a `ComponentAPI` instance for chosen element and inflates its children as if it was a Component.

#72
