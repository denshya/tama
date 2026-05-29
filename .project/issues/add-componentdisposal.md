---
id: 60
status: done
milestone: Resource Release
~github: pinely-international/tama#148
---

Add disposal stack to each component to allow granular control over memory.

```tsx
const price = new State(0)
function Navbar(this: ProtonComponent) {
  const price = new State(0)

  // If subscribing to external states, a forceful teardown should be defined:

  price.subscribe(() => { ... }, this.disposal) // <== As 2nd argument in `.subscribe`
  // Or appended to the disposal stack
  this.disposal.add(
    price.subscribe(() => { ... })
  )

  return <nav ref={navRef} life={navLifecycle}>...</nav>
}
```

## sketch

```ts
interface Disposal {
  signal: AbortSignal
  add(effect: AbortSignal | Subscription)
  adopt(other: Disposal | Disposable): void
}
```
