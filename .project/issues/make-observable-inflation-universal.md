---
id: 6
assignee: FrameMuse
labels: enhancement
~github: pinely-international/tama#41
---

Currently, if there is an observable, that contains some text, is inflated, it will snap a type of the first value: if `string`, it will try to stringify next values, if `iterable`, it will expect next to be `iterable`.

Such approach is inconvenient because `state` may be used to stream nullable JSX values where first value is `null`, currently, it will snap to `string` value and will serialize to "null" and when the JSX comes next, it will still convert to string causing problems.
