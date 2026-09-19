import { Group } from "node-group"

import { subscriptions } from "@/Subscriptions"

/**
 * Rendered state of one list position.
 * `item` is the last source value rendered at this position — its identity is
 * the reconciliation fast path — while `descriptor` is the unwrapped value
 * actually inflated (arrow components pre-evaluated), used for in-place patching.
 */
export interface ListRecord {
	item: unknown
	descriptor: unknown
	node: Node | null
}

/** Inflation facade the reconciler drives. Implemented by `WebInflator`. */
export interface ListInflation {
	/**
	 * Inflates `item` into a node, unwrapping arrow components to the descriptor
	 * they render. Returns `null` for items that produce nothing (nullish items).
	 */
	inflateListItem(item: unknown): { node: Node, descriptor: unknown } | null

	/**
	 * Patches `record`'s node in place for a new `item`. Updates
	 * `record.descriptor` on success.
	 * @returns false when the record must be rebuilt instead.
	 */
	patchListItem(record: ListRecord, item: unknown): boolean
}

/**
 * No-key, position-based list reconciler — the simple Vue-style algorithm
 * without keys, plus an identity fast path:
 *
 * 1. Leading and trailing positions whose items are `===` unchanged are skipped
 *    entirely — no DOM access, no rebinding.
 * 2. The middle is reconciled pairwise: same-shape items are patched in place
 *    (nodes reused, only changed bindings rebound), extra old records are
 *    destroyed, extra new items are inserted.
 *
 * DOM order always follows array order; items are never moved, only patched,
 * inserted, or removed. Destruction is deterministic: a record's subscriptions
 * are released and derivations created while inflating it (`State.to` forks)
 * detach when the record leaves the list.
 */
export class ListReconciler {
	readonly #parent: ParentNode
	readonly #inflation: ListInflation
	/** Whether an empty region keeps a placeholder comment (positioned lists only). */
	readonly #keepPlaceholder: boolean

	#records: ListRecord[] = []
	/** Node right before the list region, anchoring insertions at the region start. */
	readonly #anchor: ChildNode | null
	/** Placeholder comment kept while the region is empty and unanchored. */
	#placeholder: Comment | null = null

	constructor(parent: ParentNode, inflation: ListInflation, options?: { placeholder?: boolean }) {
		this.#parent = parent
		this.#inflation = inflation
		this.#keepPlaceholder = options?.placeholder === true
		this.#anchor = parent.lastChild
	}

	reconcile(items: readonly unknown[]): void {
		const records = this.#records
		const oldCount = records.length
		const newCount = items.length

		// Fast path: common prefix and suffix of identical items stay untouched.
		let start = 0
		while (start < oldCount && start < newCount && records[start].item === items[start]) start++

		let oldEnd = oldCount - 1
		let newEnd = newCount - 1
		while (oldEnd >= start && newEnd >= start && records[oldEnd].item === items[newEnd]) {
			oldEnd--
			newEnd--
		}

		// Middle: patch the common part positionally, then shed or append the rest.
		const patchEnd = Math.min(oldEnd, newEnd)
		for (let index = start; index <= patchEnd; index++) {
			this.#patchRecord(records[index], items[index], index)
		}

		if (newEnd < oldEnd) {
			for (let index = newEnd + 1; index <= oldEnd; index++) this.#destroyRecord(records[index])
			records.splice(newEnd + 1, oldEnd - newEnd)
		} else if (oldEnd < newEnd) {
			let insertCount = 0
			const created: ListRecord[] = []
			for (let index = oldEnd + 1; index <= newEnd; index++) {
				const record = this.#createRecord(items[index])
				if (record != null) {
					created.push(record)
					insertCount++
				}
			}

			this.#insertRecords(created, this.#firstNodeAt(records, newEnd + 1))
			records.splice(oldEnd + 1, 0, ...created)
		}

		this.#reconcilePlaceholder()
	}

	#reconcilePlaceholder(): void {
		if (this.#records.length > 0) {
			if (this.#placeholder != null) {
				if (this.#placeholder.parentNode != null && this.#placeholder.parentNode !== this.#parent) this.#placeholder.remove()
				else this.#parent.removeChild(this.#placeholder)
				this.#placeholder = null
			}
			return
		}

		if (this.#keepPlaceholder && this.#anchor == null && this.#placeholder == null) {
			this.#placeholder = document.createComment("reactive-iterable")
			this.#parent.appendChild(this.#placeholder)
		}
	}

	#createRecord(item: unknown): ListRecord | null {
		if (item == null) return null

		const inflated = this.#inflation.inflateListItem(item)
		if (inflated == null || inflated.node == null) return null

		return { item, descriptor: inflated.descriptor, node: inflated.node }
	}

	#patchRecord(record: ListRecord, item: unknown, index: number): void {
		if (this.#inflation.patchListItem(record, item)) {
			record.item = item
			return
		}

		// Shape mismatch — rebuild the position, reusing its place in the DOM.
		const reference = record.node as ChildNode | null
		const created = this.#createRecord(item)

		if (reference != null) this.#insertBeforeRef(created?.node ? [created.node] : [], reference)
		else if (created?.node != null) this.#insertRecords([created], this.#firstNodeAt(this.#records, index + 1))

		this.#destroyRecord(record)

		record.item = item
		record.descriptor = created?.descriptor
		record.node = created?.node ?? null
	}

	#destroyRecord(record: ListRecord): void {
		if (record.node != null) ListReconciler.destroyNode(record.node, this.#parent)
	}

	/**
	 * Releases every subscription and derivation of a subtree, then removes it.
	 * Descendants are only released — removing the root detaches the whole subtree.
	 */
	static destroyNode(node: Node, owner?: ParentNode): void {
		ListReconciler.#releaseTree(node)
		ListReconciler.#remove(node, owner)
	}

	static #releaseTree(node: Node): void {
		subscriptions.dispose(node)

		let child = node.firstChild
		while (child != null) {
			const next = child.nextSibling
			ListReconciler.#releaseTree(child)
			child = next
		}
	}

	static #remove(node: Node, owner?: ParentNode): void {
		// Group children are virtual (free-standing) — their removal must go through the group.
		if (node.parentNode == null && owner instanceof Group && owner.contains(node)) {
			owner.removeChild(node)
			return
		}
		;(node as ChildNode).remove()
	}

	#insertRecords(records: readonly ListRecord[], before: ChildNode | null): void {
		if (records.length === 0) return

		const nodes: Node[] = []
		for (const record of records) if (record.node != null) nodes.push(record.node)

		if (before != null) {
			this.#insertBeforeRef(nodes, before)
			return
		}

		// No following record — insert at the region end, after its last node
		// (or after the pre-region anchor when the region is empty).
		this.#insertAfter(this.#lastNodeOfRegion() ?? this.#anchor, nodes)
	}

	/**
	 * Inserts `nodes` right before `ref`. Real parents take the direct DOM path;
	 * virtual `Group` children are free-standing, so they go through the group's
	 * own child-aware `insertBefore`.
	 */
	#insertBeforeRef(nodes: Node[], ref: ChildNode): void {
		if (ref.parentNode === this.#parent) {
			ref.before(...nodes)
			return
		}
		for (const node of nodes) this.#parent.insertBefore(node, ref)
	}

	/** Inserts `nodes` right after `after`, or at the start of the parent when null. */
	#insertAfter(after: ChildNode | null, nodes: Node[]): void {
		const ref = after != null ? after.nextSibling : this.#parent.firstChild
		if (ref != null) {
			this.#insertBeforeRef(nodes, ref as ChildNode)
			return
		}
		// Nothing follows — appending extends the parent's content in order.
		this.#parent.append(...nodes)
	}

	#firstNodeAt(records: readonly ListRecord[], from: number): ChildNode | null {
		for (let index = from; index < records.length; index++) {
			const node = records[index].node
			if (node != null) return node as ChildNode
		}
		return null
	}

	#lastNodeOfRegion(): ChildNode | null {
		for (let index = this.#records.length - 1; index >= 0; index--) {
			const node = this.#records[index].node
			if (node != null) return node as ChildNode
		}
		return this.#anchor
	}
}
