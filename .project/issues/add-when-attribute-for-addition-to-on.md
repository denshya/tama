---
id: 11
assignee: FrameMuse
milestone: Quality Of Life
labels: jsx
~github: pinely-international/tama#54
---

Beyond `on` attribute which binds event listener callbacks, Proton could bind Signal-like/Observable values via `when` attribute. This connects well with recently added `when` method for `EventTarget`.

```tsx
function Component() {
	const pointermove = new State<PointerEvent>(null)
	return <div when={{ pointermove }}>{pointermove.$.x} {pointermove.$.y}</div>
}
```

This should further contribute to RxJs and such adoption.
