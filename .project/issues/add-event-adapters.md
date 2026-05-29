---
id: 13
assignee: FrameMuse
milestone: Quality Of Life
~github: pinely-international/tama#56
---

Event Adapters are a great pattern to keep UI neatly separated from logic.


```js
function Component() {
  const name = new State<string>(null)
  return <input when={{ change: Value(name) }} />
}
```

where `Value` is an event adapter that feeds e.target.value into the actual handler. It could be implemented somewhat like this:
```js
const Value =
  <T>(target: Function<T> | State<T>) =>
    (e: Event) =>
      target(e.target.value)
;
```

Still looking for better ergonomics than `Value(target)`, or even `AsValue(target)`, though...
