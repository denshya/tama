---
id: 15
milestone: SSR
~github: pinely-international/tama#58
---

Currently, `JSXSerializer` can serialize only non-async components, it skips async ones since they could require unpredictable amount of time to resolve, which negatively impacts server performance.

However, it is a common practice to load things asynchronously in components, which should be rendered on server for better SEO and load speed.

- [x] Consider options to choose components to skip or to await
- [ ] Consider options to set a timeout for async components
