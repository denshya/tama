---
id: 56
milestone: SSR
~github: pinely-international/tama#139
---

Add `JSXHydrator` to optionally extend `WebInflator`, so that if a client receives already generated html page, `WebInflator` doesn't create new element, but uses existing ones to update them if needed. It may allow creating new elements if certain elements are missing.
