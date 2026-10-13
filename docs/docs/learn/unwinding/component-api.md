# Component API

The components are not actually components, they are constructors and evaluators for `Tama.Component`, this is a heart of every component.

However, it doesn't mean component **creates** a `Tama.Component`, actually it is created **before** constructor is invoked, but when it's done the component instance is passed as `this` argument.

Which opens controls to the APIs of component behavior.

## Factory

Each component needs a factory, for that you need to create a function.
It doesn't have any constraints on what can be returned.

```tsx
const EmptyComponent = () => {} // Works.
function MyApp() { return <div></div> } // Works.
```

Props are passed as the first argument, *no other arguments are not passed*.

```tsx
const EmptyComponent = (props) => {} // Works.
function MyApp(props) { return <div></div> } // Works.
```

Initial props value can be defined.
It will work in runtime, but *currently* you will have an error in TypeScript.

```tsx
class MyAppProps {}

function MyApp(props = new MyAppProps) {
  return <div></div>
}
```

Creation of `Tama.Component` is skipped for arrow functions (it can't access `this`), but not for async arrow functions (swapping views is controlled by `Tama.Component`, then it's garbage collected).

```tsx
const MyApp = () => <div></div> // Component API can't be accessed.
```

## Arrow Components Are Pure Views

Arrow components run once and only describe markup. Their reactivity is declarative — observable props flowing into DOM bindings — and the framework releases the bindings it creates when the rendered list entry is removed. A pure view needs zero lifecycle code:

```tsx
const Row = (props: RowProps) => {
  return <tr class={props.selected.to(rowClassName)}><td>{props.item.label}</td></tr>
}
```

This is safe by itself: `props.selected.to(...)` creates a fork, the fork feeds a DOM binding, and when the row is removed the binding is released and the fork stops following its source.

What an arrow component must **not** do is subscribe to anything outside its own rendered DOM — feeds, timers, window listeners, stores with an independent lifetime:

```tsx
const PriceCell = (props: { symbol: string }) => {
  const price = new State<number | null>(null)

  // Leaks: nothing owns this subscription. Removing the cell does not
  // unsubscribe it — dead callbacks accumulate on the shared feed.
  marketFeed.subscribe(props.symbol, value => price.set(value))

  return <td>{price}</td>
}
```

An arrow function has no `this`, so there is no owner to register the cleanup with — and the framework deliberately does not give one. Effects need an owner, and owners live where `this` lives: in a component declared with `function`, which receives the `Tama.Component` instance as `this`.

```tsx
function PriceCell(props: { symbol: string }) {
  const price = new State<number | null>(null)

  marketFeed.subscribe(props.symbol, value => price.set(value), { signal: this.disposal.signal })

  return <td>{price}</td>
}
```

`this.disposal` is a `Disposal` — an owner of cleanup effects. Two patterns cover everything:

- Pass `this.disposal.signal` into APIs that accept an `AbortSignal` (`subscribe`, `addEventListener`, `fetch`, ...).
- `this.disposal.add(...)` for everything else — a plain function or a subscription to run at teardown.

```tsx
function Clock() {
  const now = new State(Date.now())
  const timer = setInterval(() => now.set(Date.now()), 1_000)
  this.disposal.add(() => clearInterval(timer))

  return <span>{now}</span>
}
```

## `Tama.Component` as "Class Component"

Currently there is no such concept as Class Component, you can't use `Tama.Component` as a component.
*But if you have an interest in having it, please, create/support discussions on github.*
