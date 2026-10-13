/**
 * Registry of subscriptions bound to runtime objects (usually DOM nodes), keyed by
 * binding name — property, attribute, event, style entry — so a single binding can
 * be released for rebinding, or a whole target disposed deterministically when it
 * leaves the document.
 *
 * Most keys hold exactly one subscription, so an entry stores it directly and only
 * allocates a set once a second subscription lands on the same key.
 *
 * Node targets keep their map in a `$tamaBindings` expando — the same pattern as
 * the `$EV` event expandos — so the dispose walk is a property read instead of a
 * hash lookup and the map dies with the node even when it is never released
 * explicitly. Non-Node targets fall back to a central WeakMap.
 */
type Entry = { unsubscribe(): void } | Set<{ unsubscribe(): void }>

const BINDINGS = "$tamaBindings"

const fallbackTargets = new WeakMap<object, Map<PropertyKey, Entry>>()

/** Active bound-node sink, set while a list record inflates or patches. @internal */
let trackingSink: Set<object> | null = null
/** Set when a live inner list inflates inside the tracking window. @internal */
let trackingNestedLiveList = false

function trackIntoSink(target: object): void {
	trackingSink?.add(target)
}

/**
 * Marks the current tracking window as containing a live inner list — its region
 * can grow bound nodes at runtime, outside any window, so a bound set would go
 * stale. Records of such items fall back to the subtree release walk.
 * @internal
 */
export function noteNestedLiveList(): void {
	if (trackingSink != null) trackingNestedLiveList = true
}

/**
 * Runs `fn` while collecting every target that receives a tracked binding —
 * the reconciler stores the set so destruction releases exactly the bound
 * nodes instead of walking whole subtrees.
 * @internal
 */
export function collectTracked<T>(fn: () => T): { result: T, tracked: Set<object>, nestedLiveList: boolean } {
	const previous = trackingSink
	const tracked = new Set<object>
	trackingSink = tracked
	trackingNestedLiveList = false
	try {
		const result = fn()
		return { result, tracked, nestedLiveList: trackingNestedLiveList }
	} finally {
		trackingSink = previous
	}
}

function bindingsOf(target: object, create: boolean): Map<PropertyKey, Entry> | undefined {
	let bindings: Map<PropertyKey, Entry> | undefined

	if (target instanceof Node) {
		bindings = (target as any)[BINDINGS]
		if (bindings == null && create) {
			bindings = new Map
			;(target as any)[BINDINGS] = bindings
		}
		return bindings
	}

	bindings = fallbackTargets.get(target)
	if (bindings == null && create) {
		bindings = new Map
		fallbackTargets.set(target, bindings)
	}
	return bindings
}

function unsubscribeEntry(entry: Entry): void {
	if (entry instanceof Set) {
		for (const subscription of entry) subscription.unsubscribe()
		return
	}
	entry.unsubscribe()
}

export class Subscriptions {
	/** Tracks `subscription` under `key` on `target`. */
	track(target: object, key: PropertyKey, subscription: { unsubscribe(): void }): void {
		trackIntoSink(target)
		const bindings = bindingsOf(target, true)!

		const entry = bindings.get(key)
		if (entry == null) {
			bindings.set(key, subscription)
			return
		}
		if (entry instanceof Set) {
			entry.add(subscription)
			return
		}
		bindings.set(key, new Set([entry, subscription]))
	}

	/** Releases the entry under `key` and tracks `subscription` in its place — the rebind path. */
	replace(target: object, key: PropertyKey, subscription: { unsubscribe(): void }): void {
		trackIntoSink(target)
		const bindings = bindingsOf(target, true)!

		const entry = bindings.get(key)
		if (entry != null) unsubscribeEntry(entry)
		bindings.set(key, subscription)
	}

	/** Releases every subscription tracked under `key` on `target`. */
	release(target: object, key: PropertyKey): void {
		const bindings = bindingsOf(target, false)
		const entry = bindings?.get(key)
		if (entry == null) return

		unsubscribeEntry(entry)
		bindings!.delete(key)
		if (bindings!.size === 0) this.#forget(target)
	}

	/** Releases every subscription tracked on `target` and forgets the target. */
	dispose(target: object): void {
		const bindings = bindingsOf(target, false)
		if (bindings == null) return

		for (const entry of bindings.values()) unsubscribeEntry(entry)
		bindings.clear()
		this.#forget(target)
	}

	/** Whether anything is tracked on `target`. Handy for tests. */
	has(target: object): boolean {
		const bindings = bindingsOf(target, false)
		return bindings != null && bindings.size > 0
	}

	#forget(target: object): void {
		if (target instanceof Node) delete (target as any)[BINDINGS]
		else fallbackTargets.delete(target)
	}
}

/** Process-wide registry of node-bound subscriptions. @internal */
export const subscriptions: Subscriptions = new Subscriptions
