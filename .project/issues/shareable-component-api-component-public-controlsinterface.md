---
id: 23
milestone: Richer Use Cases
~github: pinely-international/tama#66
---

Shareable version of Component Shell. The component can be inflated and have public interface (method and properties). It also can be initiated and stopped from outside the constructor.

It is useful for creating distinct chunks of components with some internal logic while providing public interface for e.g. injecting values or call methods for predefined mutations.

Todo list Example - adding and removal document mutations are defined internally, methods “add“ and “remove“ are public, allowing consumers to push new todo items. This exposes component controls along with the actual element itself, while preserving possibility of adding it to any tree using direct or JSX methods.

---

This changes UI formula from f(state, data) = UI to f(state, data) = UI & Controls

---

```tsx
function Component(this) {
  this.public.onLoad = () => {}
  
  return <div />
}
```

https://vuejs.org/guide/typescript/options-api

---

Could be a class that has custom inflation, which uses `Inflator` and 

```tsx

```
