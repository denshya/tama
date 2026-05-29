---
id: 43
assignee: FrameMuse
milestone: Reconciling
labels: enhancement
~github: pinely-international/tama#109
---

```jsx
function Widget() {
  const button = document.getElementById("button")
  button.append("Click me")

  return <div style={...}>{button}</div>
}
```

## Sketch

```tsx
// Can be Observable.
const propsItems = ["Wake Up", "Shower", "Eat", "Sleep"]
// new State(["Wake Up", "Shower", "Eat", "Sleep"])

const items = new Reconcile.List(propsItems?, config?)
items.reconcile([...])
items.reconcileAt(2, "Cat")
items.add("Meow")
items.delete("")

// There must a way to defined objects keys.
items.selectKey(item => item.id) // Variant 1.
items.selectKey((item, other) => other?.key) // Variant 2.

// new Reconcile.List(..., { selectKey: item => item.id })
// new Reconcile.List(..., { selectKey: "key" })

// Ok ->
<div>{items.map(item => <span>{this.text} {item}</span>)}</div>
<div>{items.remap(item => <span key={item.id}>{this.text} {item}</span>)}</div>
<div>{items.select(item => <span>{this.text} {item}</span>)}</div>

// Problems here ->
const state = new State(...)
<div>{items.map(item => state ? "meow" : <span>{this.text} {item}</span>)}</div>
// Can be solved by using a Component.
```

## Sketch 2

```jsx
const reconciler = new Tama.Reconciler("")

function Component() {
  const items = new StateArray([])

  return (
    <div>{reconciler.reconcile(items.map(item => <div>{item}</div>))}</div>
  )
}

/**
 * You probably don't need this.
 * This eagerly compares old and new items to diff the changes.
 *
 * This can give a radical performance gain as well as slowdown your app.
 * You must know with certainty that your list may be big or change **order** often.
 *
 * - **Big** >= 100 items
 * - **Often** <= every 1 second
 */
class ListReconciler {}
const listReconciler = new ListReconciler

function Component() {
  const items = new StateArray([])
  const itemsReconciled = listReconciler.reconcile(items, item => item.id)
  // If there is no `id`, `uid`, `uuid` nor `index`, the reconciliation will be non-keyed.

  return (
    <div>{itemsReconciled.map(item => <div>{item}</div>)}</div>
  )
}

class JSXReconciler {}
const jsxReconciler = new JSXReconciler
class JSXReconcilerInflateAdapter {}


function Component() {
  this.inflator.adapters.add(JSXReconcilerInflateAdapter)

  const items = new StateArray([])

  return (
    <div>{items.map(item => <div key={item.id}>{item.content}</div>)}</div>
  )
}
```
