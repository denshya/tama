---
id: 38
status: done
assignee: FrameMuse
milestone: Quality Of Life
~github: pinely-international/tama#82
---

With #55, this would be possible

```tsx
const ref = null
<div ref={x => ref = x} />
```

However, this requires a bit of boilerplate code, so to reduce it and make it look similar to React - `Proton.Ref` is proposed, which is literally just an object with `current property`.

Optionally, it could have a mechanism to either remember what was accessed (seems difficult) or have a callback once a value is populated for consumer to be sure the accesses of `ref` won't be lost.
