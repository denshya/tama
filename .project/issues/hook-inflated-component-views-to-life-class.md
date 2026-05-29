---
id: 37
assignee: Divayang-2006
milestone: Lifecycle
~github: pinely-international/tama#81
---

Provide `component.view.life` with DOM lifecycle.

```ts
component.view.life.scoped(() => {
  // Should be called each time when current element is connected to the DOM.
  return () => {
    // Should be called each time when current element is disconnected.
  }
})
```

There are two options to implement, either explicitly as #70 or implicitly internally.
