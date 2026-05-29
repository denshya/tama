---
id: 2
status: done
assignee: FrameMuse
labels: good first issue
~github: pinely-international/tama#32
---

Spec:
https://pinely-international.github.io/proton/learn/guides/conditional-mounting#jsx-attribute-guarding

## Sketch

```tsx
export function Guard(value, predicate) {}
namespace Guard {
  export function avoid(value) {}
  export function require(value) {}
}
```

## Usages

There are some evidence of it being used in demos as per old undocumented implementation, if you desire, it can be fixed as well:

https://github.com/pinely-international/proton/blob/1771f91646b35cea192bc06310e2095ff905a47a/demos/simple/src/app/ui/Selector/Selector.tsx#L33-L35
