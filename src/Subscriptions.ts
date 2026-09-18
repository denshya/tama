/**
 * Registry of subscriptions bound to runtime objects (usually DOM nodes), keyed by
 * binding name — property, attribute, event, style entry — so a single binding can
 * be released for rebinding, or a whole target disposed deterministically when it
 * leaves the document.
 *
 * Most keys hold exactly one subscription, so an entry stores it directly and only
 * allocates a set once a second subscription lands on the same key.
 */
type Entry = { unsubscribe(): void } | Set<{ unsubscribe(): void }>

function isSet(entry: Entry): entry is Set<{ unsubscribe(): void }> {
	return entry instanceof Set
}

export class Subscriptions {
	private readonly targets = new Map<object, Map<PropertyKey, Entry>>()

	/** Tracks `subscription` under `key` on `target`. */
	track(target: object, key: PropertyKey, subscription: { unsubscribe(): void }): void {
		let perKey = this.targets.get(target)
		if (perKey == null) {
			perKey = new Map
			this.targets.set(target, perKey)
		}

		const entry = perKey.get(key)
		if (entry == null) {
			perKey.set(key, subscription)
			return
		}
		if (isSet(entry)) {
			entry.add(subscription)
			return
		}
		perKey.set(key, new Set([entry, subscription]))
	}

	/** Releases every subscription tracked under `key` on `target`. */
	release(target: object, key: PropertyKey): void {
		const perKey = this.targets.get(target)
		const entry = perKey?.get(key)
		if (entry == null) return

		if (isSet(entry)) {
			for (const subscription of entry) subscription.unsubscribe()
		} else {
			entry.unsubscribe()
		}
		perKey!.delete(key)
		if (perKey!.size === 0) this.targets.delete(target)
	}

	/** Releases every subscription tracked on `target` and forgets the target. */
	dispose(target: object): void {
		const perKey = this.targets.get(target)
		if (perKey == null) return

		for (const entry of perKey.values()) {
			if (isSet(entry)) {
				for (const subscription of entry) subscription.unsubscribe()
			} else {
				entry.unsubscribe()
			}
		}

		perKey.clear()
		this.targets.delete(target)
	}

	/** Whether anything is tracked on `target`. Handy for tests. */
	has(target: object): boolean {
		return this.targets.has(target)
	}
}

/** Process-wide registry of node-bound subscriptions. @internal */
export const subscriptions = new Subscriptions
