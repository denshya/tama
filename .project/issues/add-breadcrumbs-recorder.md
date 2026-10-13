---
id: 61
---

Add an opt-in BreadcrumbRecorder, similar to rrweb breadcrumbs but simpler and without extra hijacking of inputs, clicks, console, network, etc. All events are recorded at the seams Tama already owns, so there are zero new global listeners, zero wrapped globals, and zero runtime cost when unused. Tree-shakeable, consistent with the library philosophy.

## Use Cases

- Error context / debugging: a trail around the deliberately isolated errors (`this.tree.catch`), turning a thrown error into context.
- Analytics / user journey: high-level navigation, mounts, transitions, renders.

## Recorded Events

| kind | tap point | notes |
|---|---|---|
| `component.mount` / `component.detach` | `Life.when("enter"/"exit")` | entry carries component identity |
| `error` | `TreeAPI.catch` / `thrown` daisy-chain | recorder can tap at any tree level |
| `transition` | `TransitionAPI` snapshot lifecycle (`markPending`, `markRunning`, `markFinished`) | carries `previous`/`next` and timing |
| `render` | `Inflator.inflateObservable` firing | coalesce: one entry per component per tick |
| `event` | `EventDelegator.delegate` | only events routed through delegation |
| `manual` | `this.tree.breadcrumb(msg, data)` | dispatched up the same parent chain as `thrown` |

## Event Strategy (no hijacking)

- Event breadcrumbs record nothing by default. They activate only when events flow through `EventDelegator.delegate()`. Direct `addEventListener` calls stay invisible; we do not fake them.
- Input values, key presses, scroll come only through the manual `breadcrumb()` call from user handlers.
- No `window`/`document` capture listeners, no console wrapping, no fetch/XHR interception.

## Entry Anatomy

```ts
interface Breadcrumb {
  kind: "mount" | "detach" | "error" | "transition" | "render" | "event" | "manual"
  level: "error" | "warning" | "info" | "debug"
  timestamp: number
  component?: unknown // identity, not name string - lets users resolve
  data?: unknown // thrown error / transition snapshot / event
}
```

The sink is a subscriber provided by the user; the recorder stores nothing (no built-in state manager). A bounded ring buffer can be a separate tiny helper.

## Watch-outs

- `EventDelegator` is WIP (unsubscribe logic commented out). The recorder tap should be one line inside `delegate()` after `parent.addEventListener(type, bound)` so it never depends on unfinished parts.
- Coalesce renders: one state set fires many subscriptions, batch per component per frame.
- Payload discipline: entries should stay structured-cloneable. Side benefit: no automatic input/console/network data leaks, unlike rrweb which needs sanitization plugins.

## Explicitly Out of Scope

- No built-in storage, no replay engine. Collection is library-adjacent; replay and analysis stay in user land.
