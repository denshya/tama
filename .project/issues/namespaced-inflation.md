---
id: 26
milestone: Richer Use Cases
~github: pinely-international/tama#69
---

```tsx
<namespace uri="http://www.w3.org/2000/svg">
  <path ... />
</namespace>
```

and/or

```tsx
<path ... ns="http://www.w3.org/2000/svg" />
```

All these contribute to solving a namespace problem, which conflicts with custom elements, creates strong dependency of correct list of elements for inflation, fails [Atomic Inflation](https://denshya.atlassian.net/browse/PROT-27) and creates additional burden on implementation correctness.
