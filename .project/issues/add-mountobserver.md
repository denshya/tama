---
id: 54
status: done
assignee: FrameMuse
~github: pinely-international/tama#132
---

**Example 1**
```tsx
function Component() {
  const mounter = new MountObserver
  mounter.loop(() => {
    
    return () => ...
  })


  if (else) {
    const element = getThirdPartElement()
    mounter.observe(element)
    return element
  }

  if (something) {
    return <div ref={mounter} />
  }

  return <div ref={mounter} />
}
```
**Example 2**
```tsx
function Component() {
  this.view.life.loop(() => {
    
    return () => ...
  })


  if (else) {
    return getThirdPartElement()
  }

  if (something) {
    return <div />
  }

  return <div />
}

```
**Example 3** (Outside of component)
```tsx
const mounter = new MountObserver
mounter.loop(() => {
    
  return () => ...
})

const element = document.createElement("div")
mounter.observe(element)
```
