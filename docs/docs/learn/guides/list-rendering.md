---
sidebar_position: 6
---

# List Rendering

Tama accepts arrays and iterables directly as children.
List updates use **no-key, position-based reconciliation**: unchanged items keep their DOM nodes, changed items are patched in place, and there is no `key` prop contract like React's.

## Static Lists

Plain arrays work exactly as you would expect.

```tsx
<ul>
  {[1, 2, 3].map(item => <li>{item}</li>)}
</ul>
```

## Observable Lists

For lists that change over time, `StateArray` is the most convenient default from `@denshya/reactive`.

```tsx
import { StateArray } from "@denshya/reactive"

const items = new StateArray(["Milk", "Bread"])

function ShoppingList() {
  const rows = items.map(item => <li>{item}</li>)
  return <ul>{rows}</ul>
}
```

## Reconciling Lists

`map` re-runs its callback for every item on every update, which is fine for small lists but wasteful for large ones.
Attach a `StateReconciler` instead: it caches the mapped views by item identity, so surviving items keep both their view instance and their DOM nodes across updates.

```tsx
import { StateArray, StateReconciler } from "@denshya/reactive"

const todos = new StateArray<TodoItem>([])
todos.reconciler = StateReconciler.IDENTITY

function TodoList() {
  // The same `map` as always — with a reconciler installed, surviving rows
  // keep their views and DOM across updates.
  return <ul>{todos.map(todo => <TodoRow todo={todo} />)}</ul>
}

todos.set(todos.get().filter(todo => todo.id !== id))
// Surviving rows keep their <li> nodes — the callback ran zero times for them.
```

For items replaced by new objects with a stable domain identity, match on a field instead:

```ts
todos.reconciler = new StateReconciler((a, b) => a.id === b.id)
```

With a reconciler installed, the `map` callback must be **pure with respect to the reconciler's equality**: items that are "the same" must produce the same view, because the callback runs at most once per surviving item.
Mutate items through their `State` fields (fine-grained updates still flow into unchanged rows) rather than mutating plain fields and re-setting the array.

## How Updates Are Reconciled

When an iterable child source updates, Tama reconciles the new collection against the rendered one positionally, without keys:

- **Identical items (`===`) keep everything.** Leading and trailing runs of unchanged items are skipped entirely — no DOM access, no rebinding. This is the common case for remove/insert-heavy updates.
- **Changed items are patched in place.** A position that receives a different item of the same shape keeps its DOM element; only changed props and children are rebound (including event handlers and observable text).
- **Shape mismatches rebuild that position only.** A different element type, class components, fragments, or form-control value changes fall back to re-creating just that item.
- **DOM order always follows array order.** Items are patched, inserted, or removed — never moved. Two swapped items each get patched, like Vue's no-key mode.

A consequence of positional patching: an item that leaves the list and later comes back gets a **new** DOM node, even if the item object is identical. Only items that survive consecutive updates keep their nodes.

### Deterministic Disposal

When a record leaves the list, every subscription bound to its nodes is released.
Derived states (like a `State.to` fork inside a row component) detach from their source once their last observer leaves — so a fork bound to a row's element dies with the row.
Removing rows does not accumulate listeners or pinned nodes; a fork that is never bound to anything outlives its row, so always bind forks you render.

## What To Do In Practice

The short version: use `StateArray` when the list itself is mutable, attach a `reconciler` when it grows large or updates often, and keep row-specific state in stable model objects when item identity must survive list changes.

### Prefer `StateArray` For Mutable Collections

Use `StateArray` when you want list mutations such as `push`, `splice`, or `sort` to trigger updates directly.

```tsx
const items = new StateArray(["A", "B"])

items.push("C")
items.splice(1, 1)
```

### Replace Plain Arrays Explicitly

If a list lives inside `State`, treat the array as immutable. Build a new array and assign it back whenever the contents change.

```tsx
const items = new State(["A", "B"])

items.set(current => [...current, "C"])
```

### Keep Item State Outside The Rendered Row When Identity Matters

If a row needs to preserve local state, animation state, focus, or unmanaged DOM across list changes, store the row data in objects keyed by `id` instead of relying on row position.

```tsx
class TodoItem {
  constructor(readonly id: string, readonly title: State<string>) {}
}

const todos = new StateArray<TodoItem>([])
todos.reconciler = StateReconciler.IDENTITY
```

## When Plain `map` Is Fine

Plain `map` (whole-view re-derivation) is often completely acceptable for:

- small lists
- rarely-updating lists
- filtered and sorted views
- dashboards where row identity is already modeled in store objects

Reach for `reconciler` when lists are large or mutate often — removals and insertions stop paying for the rows that did not change.

> *Premature optimization is the root of all evil. Start with the simplest thing that works, and only optimize if you have a real problem.*

## Related Guides

- [Building Apps](../how-to-use/building-apps.md)
- [Custom State](../custom/state.md)
- [Pre-inflation](./pre-rendering.md)
