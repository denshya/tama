---
id: 55
labels: enhancement
~github: pinely-international/tama#133
---

Split inflators to make the best developer experience.


**Currently**, you should import `WebInflator`, which handles all common usage. 
```ts
const inflator = new WebInflator
document.body.append(inflator.inflate(123))
document.body.append(inflator.inflate(<div />))
document.body.append(inflator.inflate([<div />, <div />]))

document.body.append(inflator.inflate(new State(123)))
```

```ts
const jsxInflator = new WebJsxInflator
jsxInflator.inflate(<div />)
jsxInflator.attributes.set("classMods", context => ...)
jsxInflator.elements.set("game", context => ...)
```

```ts
const signalInflator = new SignalInflator
signalInflator.inflate(new Signal(123))
```

```ts
const inflator = new Inflator
inflator.adapters.add(JsxInflator)
inflator.adapters.add(SignalInflator)
inflator.adapters.add(JsnInflator)
```
