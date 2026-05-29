---
id: 50
milestone: Quality Of Life
labels: enhancement, jsx
~github: pinely-international/tama#125
---

## Sketches

**Sketch of optional activation of this feature**
```ts
const inflator = new WebInflator
inflator.jsxAttributes.add(JSXCustoms.AsAttribute)
```

**Example as Wrapper**

```tsx
function Component() {
  return (
    <div as={WrapperComponent}>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  )
}

function WrapperComponent(props: { children: unknown }) {
  return <section>{props.children}</section>
}
```

**Example as Context Provider**

```tsx
function Component() {
  return (
    <div as={ContextComponent}>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  )
}

class Context { }
function ContextComponent(this, props: { children: unknown }) {
  this.tree.context.require(new Context)

  return props.children
}
```

```tsx
import { useState } from "react"

function Component() {
  return (
    <react as={ReactComponent}>
      <h2>Title</h2>
      <p>Description</p>
    </react>
  )
}

function ReactComponent() {
  useState(123)
  
  return <div />
}
```

---

- `as` Attribute can be introduced optionally
- `as` Attribute can be used to Introduce React-compatible Components in TamaJs
