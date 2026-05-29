---
id: 36
assignee: santhosh-7777
milestone: Lifecycle
~github: pinely-international/tama#80
---

This is a part of the new design of Proton View Lifecycle, `Life` class is used in `ViewAPI` to provide lifecycle interface. Which can be hooked during inflation to represent actual lifecycle of an element in DOM.

## Sketch

```ts
import { StateFSM } from "@denshya/reactive"

import { Subscriptable } from "./Observable"

class Life {
  alive = false

  /** @internal */
  fsm = new StateFSM<"init" | "enter" | "exit">("init")



  when(event: "enter" | "exit"): Subscriptable<void> {
    return this.fsm.when(event)
  }
  delegate(value: { onEnter?(): void, onExit?(): void }) {
    this.fsm.subscribe(phase => {
      if (phase === "enter") value.onEnter?.()
      if (phase === "exit") value.onEnter?.()
    })
  }

  /**
   * Creates a scope within a lifecycle.
   * When enters, invokes `callback`; when exists, aborts `signal`.
   *
   * @example
   *
   * ```ts
   * this.view.life.scoped(signal => {
   *   window.addEventListener("scroll", event => { } { signal })
   *   window.addEventListener("pointerdown", event => { }, { signal })
   *   window.addEventListener("pointerup", event => { }, { signal })
   * })
   * ```
   */
  scoped(callback: (signal: AbortSignal) => void): void
  /**
   * Creates a scope within a lifecycle.
   * When enters, invokes `callback`; when exists, aborts `signal`.
   *
   * @example
   * Familiar React-style subscribe/unsubscribe pattern.
   * ```ts
   * this.view.life.scoped(() => {
   *   const abortController = new AbortController
   *   const signal = abortController.signal
   *
   *   window.addEventListener("scroll", event => { } { signal })
   *   window.addEventListener("pointerdown", event => { }, { signal })
   *   window.addEventListener("pointerup", event => { }, { signal })
   *
   *   return () => abortController.abort()
   * })
   * ```
   *
   * @example
   * When `subscribe` returns an unsubscribe callback.
   * ```ts
   * this.view.life.scoped(() => observable.subscribe(x => x))
   * ```
   *
   * @example
   * When `subscribe` returns subscription object.
   * ```ts
   * this.view.life.scoped(() => observable.subscribe(x => x).unsubscribe) // Or
   * this.view.life.scoped(() => observable.subscribe(x => x))
   * ```
   */
  scoped(callback: () => () => void): void
  /**
   * Creates a scope within a lifecycle.
   * When enters, invokes `callback`; when exists, aborts `signal`.
   *
   * @example
   * When `subscribe` returns subscription object, it will call the `unsubscribe` method.
   * ```ts
   * this.view.life.scoped(() => observable.subscribe(x => x))
   * ```
   */
  scoped(callback: () => () => { unsubscribe: () => void }): void
  /**
   * Creates a scope within a lifecycle.
   * When enters, invokes `callback`; when exists, aborts `signal`.
   */
  scoped(callback: ((signal: AbortSignal) => void) | (() => () => void) | (() => () => { unsubscribe: () => void })): void { }
}

export default Life
```
