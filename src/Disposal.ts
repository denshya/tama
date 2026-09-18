import { Scope } from "@denshya/reactive"

import { onDemandRef } from "./Inflator/web/helpers"
import { Subscription } from "./Observable"

/**
 * Owns a set of cleanup effects and runs them all when aborted.
 *
 * A disposal is an `AbortSignal` factory: `add` ties an effect to the signal,
 * and aborting the signal (or `using` the disposal) runs every effect once.
 * Combined with `Scope`, derivations created inside the signal's scope —
 * like `State.to` forks — detach automatically when the disposal aborts.
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

/** Property key under which an inflated node carries the disposal of its creation scope. @internal */
export const DISPOSAL: unique symbol = Symbol("tama.disposal")

/**
 * Chains `disposal` to the ambient scope, if any — it dies together with its owner.
 * @internal
 */
export function withinScope(disposal: Disposal): void {
	const outer = Scope.signal()
	if (outer == null) return

	if (outer.aborted) disposal[Symbol.dispose]()
	else outer.addEventListener("abort", () => disposal[Symbol.dispose](), { once: true })
}
