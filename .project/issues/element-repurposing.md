---
id: 22
milestone: Reconciling
~github: pinely-international/tama#65
---

Similar to baking an element, which based on providing external interface for creating new components by a compiled function.

Reusing elements has two key differences:

baked version is used internally only

baked version is used for patching existing version of an element

This way, the element can be repurposed without being reevaluated from scratch.

---

This is usually the way for index-based list reconciliation, when element is assigned with new properties instead of creating a new one and replacing it. #39
