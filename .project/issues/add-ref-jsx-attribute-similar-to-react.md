---
id: 12
status: done
assignee: FrameMuse
milestone: Quality Of Life
labels: good first issue
~github: pinely-international/tama#55
---

Definitely lacking a way to retrieve an element from JSX without "manually" inflating it.
It seems the way React does it is possible and fits well.

```tsx
function Component() {
	return <div ref={element => console.log(element)} /> // Or
	return <div ref={elementRef} />

	return <div ref={[elementRef, element => console.log(element), ...]} /> // Enhancement.
}
```
