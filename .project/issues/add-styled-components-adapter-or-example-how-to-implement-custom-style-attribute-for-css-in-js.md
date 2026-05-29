---
id: 49
milestone: Richer Use Cases
~github: pinely-international/tama#124
---

**Desired code**

```tsx
import { css } from "styled-components"

function Component() {
  return (
    <div style={styledStyle}>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  )
}

const styledStyle = css`
  background: red;

  &:hover {
    background: blue;
  }
`
```
