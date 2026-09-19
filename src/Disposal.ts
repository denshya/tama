import { onDemandRef } from "./Inflator/web/helpers"
import { Subscription } from "./Observable"

/**
 * Owns a set of cleanup effects and runs them all when aborted.
 *
 * A disposal is an `AbortSignal` factory: `add` ties an effect to the signal,
 * and aborting the signal (or `using` the disposal) runs every effect once.
 * Class components expose one as `this.disposal` — it is the owner for effects
 * whose lifetime matches the component: pass `this.disposal.signal` into
 * `subscribe`-style APIs and `add` everything else (timers, listeners).
 */
export class Disposal {
	/** @internal */
	controller: { current: AbortController } = onDemandRef(() => new AbortController)
	get signal(): AbortSignal { return this.controller.current.signal }

	/** Runs `effect` when this disposal aborts, or immediately if it already has. */
	add(effect: (() => void) | Subscription): void {
		const signal = this.signal

		if (typeof effect === "function") {
			if (signal.aborted) effect()
			else signal.addEventListener("abort", effect, { once: true })
			return
		}

		if (signal.aborted) effect.unsubscribe()
		else signal.addEventListener("abort", () => effect.unsubscribe(), { once: true })
	}

	/** Chains `other` to this disposal: aborting this aborts `other` too. */
	adopt(other: Disposal | Disposable): void {
		if (other instanceof Disposal) {
			this.add(() => other.controller.current.abort())
			return
		}

		this.add(() => other[Symbol.dispose]())
	}

	[Symbol.dispose](): void {
		this.controller.current.abort()
	}
}
