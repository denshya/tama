---
id: 10
assignee: FrameMuse
milestone: Resource Release
~github: pinely-international/tama#53
---

Currently all events are subscribed directly to the element they are found in, this causes two issues:
- memory overuse for big lists
- difficulties in releasing resources - collecting subscriptions for each element and then associating them with their relative connection point is much more difficult than collecting elements themselves and indirectly subscribing to the listeners.

#40
