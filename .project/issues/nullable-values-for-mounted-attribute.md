---
id: 7
assignee: FrameMuse
milestone: Quality Of Life
labels: enhancement, jsx
~github: pinely-international/tama#42
---

Currently `mounted` property is strict to `boolean` type and may behave in the weird way when faces other types.

To make this simpler, nullable values can be allowed, but it comes with a downside: if you intentionally put `null` it may remove element without clear intent.
