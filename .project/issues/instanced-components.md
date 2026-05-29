---
id: 25
milestone: Richer Use Cases
~github: pinely-international/tama#68
---

```ts
const instancedInflator = new WebInstancedInflator
instancedInflator.inherits(inflator)
inflator.adapters.add(WebInstancedInflator.)
```



```ts
function ErrorCover() {}

ErrorCover.Instanced = instancedInflator.instance(<ErrorCover />)
const instancedInflator = new WebInstancedInflator
instancedInflator.inherits(inflator)
inflator.adapters.add(WebInstancedInflator.)
```



```ts
function ErrorCover() {}

ErrorCover.Instanced = instancedInflator.instance(<ErrorCover />)

inflator.adapters.add(Proton.Instanced.InflatorAdapter)
inflator.adapters.add(Proton.Singleton.InflatorAdapter)
```

```ts
function ErrorCover() {}
ErrorCover.Instanced = new Proton.Instanced(<ErrorCover />, { pool: 5 })
ErrorCover.Singleton = new Proton.Singleton(<ErrorCover />)


<ErrorCover /> // A new element will created each time.
<ErrorCover.Instanced /> // Creates minimum 5 elements and then reuses them, creates more if needed.
<ErrorCover.Singleton /> // Creates only one element and always reuses it.


inflator.adapters.add(Proton.Instanced.InflatorAdapter)
inflator.adapters.add(Proton.Singleton.InflatorAdapter)
```

```ts
function ErrorCover() {}
ErrorCover.Instanced = new Proton.Instanced(<ErrorCover />, { pool: 5 })
ErrorCover.Singleton = new Proton.Singleton(<ErrorCover />)


<ErrorCover /> // A new element will created each time.
<ErrorCover.Instanced /> // Creates minimum 5 elements and then reuses them, creates more if needed.
<ErrorCover.Singleton /> // Creates only one element and always reuses it.
```
