---
id: 14
milestone: SSR
~github: pinely-international/tama#57
---

As `JSXSerializer` uses DOM values, it can't be used in DOM-less environment. Allow using `JSXSerializer` without DOM by checking if the properties exist to avoid errors.
