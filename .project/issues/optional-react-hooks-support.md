---
id: 30
status: not_planned
assignee: UtkarshAnandd
milestone: Richer Use Cases
~github: pinely-international/tama#73
---

React hooks converter to `State`.

React hooks a thing that works by rerunning everything every time, but States are different - they are Signal-Like structures.

To make sure the transition from React to Proton is simpler, it's better to be able to simply copy-paste code from React, that's why this feature can make a difference.

## Sketch

```tsx
function Component() {
  const state = Tama.use(() => {
    const [pending, setPending] = useState(true)
    useEffect(() => { ... })
    return { pending }
  }

  state instanceof State // true 
}
```

```ts
ReactExternalHook.from(useCustomHook)
new ReactExternalHook(() => {
  const [hidden, setHidden] = useState(false);

  return { hidden }
})
```
