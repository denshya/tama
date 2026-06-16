import { onDemandRef } from "./Inflator/web/helpers"
import { Subscription } from "./Observable"

export class Disposal {
  /** @internal */
  controller: { current: AbortController } = onDemandRef(() => new AbortController)
  get signal(): AbortSignal { return this.controller.current.signal }

  add(effect: AbortSignal | Subscription | (() => void)): void { }
  adopt(other: Disposal | Disposable): void { }
}
