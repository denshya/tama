---
id: 24
milestone: Quality Of Life
~github: pinely-international/tama#67
---

## Rough sketch
```tsx
function Component(this: any, props: any) {
  this.fallback = new Proton.Fallback({})
  this.fallback.error.set(new TypeError("")) // Equals `throw new TypeError("")`.

  // this.fallback.
  this.boundary.add(new class Fallback { }())
}
```
