---
id: 21
assignee: askhat
milestone: Quality Of Life
labels: good first issue
~github: pinely-international/tama#64
---

It would be useful to implement such utils to ease inflation of elements without heavy JSX.

## Interface Sketch

```tsx
  /**
   * HTML templating shorthand.
   *
   * @example
   * f`ul>li*3` // => <ul><li></li><li></li><li></li></ul>
   * */
  export function f(strings: readonly string[]): Node { }
  /**
   * For plain DOM elements arranging.
   *
   * @example
   * const container = document.createElement("div")
   *  container.append(WebInflator.h(Component))
   *
   *  async function Component(this: ProtonComponent) {
   *    const element = document.createElement("div")
   *
   *    this.view.set("waiting...")
   *    await new Promise(...)
   *
   *   return element
   * }
   */
  export function h(type: string | Function, props?: {}, children?: unknown[]): Node { }
```

## Description

- `f` — a template tag + tiny shorthand parser, supports `>`, `+`, `*n`, `#id`, `.class`, and simple `[...]` attributes. Accepts template substitutions and returns a `Node` or `DocumentFragment`.
- `h` — element/component inflater:
  * `h('div', props, children)` creates DOM elements with `class`, `style`, `on*` handlers, `text`/`html` shortcuts, etc.
  * `h(ComponentFn, props, children)` calls function components (bound to a `ProtonComponent`-like `this` with `view.set`) and supports async returns (returns `Promise<Node>` when component is async).
  * Basically a https://github.com/hyperhype/hyperscript

- Utilities: child normalization, props setting, attribute parsing, and helpers for converting component return values to nodes.
- TypeScript types and JSDoc for clarity and future extension.
- Usage examples showing sync/async components and f/h usage.
- Cover implementation with tests 🐱
