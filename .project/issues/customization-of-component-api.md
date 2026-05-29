---
id: 19
assignee: Harshit9026
labels: good first issue
~github: pinely-international/tama#62
---

```ts
inflator.componentContext.set("test", context => {
    return 123
})

// Later it will assigned to `this` context of a component.

function Component(this) {
  console.log(this.test) // 123
}

inflator.inflateComponent(Component)
```

This would set properties of this in a component, which should decrease amount of boilerplate.
