---
id: 34
milestone: Richer Use Cases
~github: pinely-international/tama#77
---

Currently Components are only functions that has `this` context, which is almost a class.

Class-based approach can be supported as well

```tsx
class MyComponent extends Proton.Component {
  constructor(inflator) {
    super(inflator)

    this.render()
  }

  async render() {
    this.view.set(<Loader />)
    await request
    this.view.set(<div>...</div>)
  }
}
```
