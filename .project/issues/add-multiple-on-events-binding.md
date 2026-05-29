---
id: 3
status: done
assignee: 1amKhush
milestone: Quality Of Life
labels: good first issue
~github: pinely-international/tama#33
---

```tsx
class Feature {
  state = 0

  listeners = {
    click: () => this.state = 1,
    hover: () => this.state = 2,
  }
}
function Component() {
  const adoptedFeature = new Feature

  return <div on={[adoptedFeature.listeners, { hover: () => { /* Another Action */ } }]} />
}
```
