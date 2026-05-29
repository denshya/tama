---
id: 28
status: done
assignee: meetdhorajiya
milestone: Richer Use Cases
~github: pinely-international/tama#71
---

`this.view` can be like FSM.

```tsx
async function App() {
  this.view.transitions = new Set
  this.view.transitions.add(async (transit, previous, next) => {
    await process
    // The component will keep previous view until all transitions resolved.
    
    // `previous` and `next` are exactly same values supplied to `view.set`,
    // usually JSX, which can be should inflated to modify element.
    
    const previousElement = this.inflator.inflate(previous)
    previousElement.style.background = "rgba(0,0,0,0.75)" // Dimmed.
    await process2
    previousElement.style.background = ""
    
    const nextElement = this.inflator.inflate(next)
    next.style.background = "rgba(0,0,0,0.75)" // Dimmed.
    
    await transit()
    // After transition completed.
    next.style.background = ""
  })
  this.view.transitions.add(document.startViewTransition)
}
```
