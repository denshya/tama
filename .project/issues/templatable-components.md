---
id: 62
milestone: Reconciling
labels: enhancement
---

Opt-in templating for components. A component declares intent once, then every following instance of the same component shape is produced by cloning a prebuilt DOM variant and filling in values, instead of walking the JSX tree and creating elements again.

This unifies three older notes: `apply-optimization-on-component-default-view` (#45), `evaluation-of-many-identical-components` (#20) and `instanced-components` (#25), and it builds directly on the clone+patching already proven in `ListReconciler`.

## Goal

- Turn "deep inflation" into "clone once, then bind values".
- Precompute the layout permutations that conditionals (`mounted`) can produce.
- Select a variant with a bitmask, cap the table at 32 entries.
- Keep the feature cold: zero cost until a component asks for it.

```tsx
function Component(this: Tama.Component) {
  this.inflators.add(StencilInflator)
  return <div>{/* ... */}</div>
}
```

## Current behavior (baseline)

- `WebInflator.inflateComponent` runs the factory once per instance, feeds the result into `component.view`, then deep inflates `component.view.current` from scratch.
- `Inflator.inflate` runs adapters, but `WebInflator.inflate` short-circuits JSX and `Node` before adapters ever run. So an adapter cannot intercept a component view today. The activation has to be a per-component hook, not a plain adapter.
- `MountGuard` implements `mounted` by swapping an element with a comment placeholder. `ListReconciler` deliberately refuses to clone guarded items (see the spec "does not clone guarded items"), which is exactly the gap this feature fills.
- `ListReconciler` already does clone-based inflation keyed by a structural signature (`signatureOfDescriptor`). That is the working proof that "clone and rebind" beats "deep inflate" for repeated shapes.

## Model

| Term | Meaning |
|---|---|
| Stencil | Prebuilt table of DOM variants for one component shape |
| Shape | Structural signature of the returned JSX, values ignored |
| Slot | A position that is not cloned verbatim: dynamic value, ref, handler, custom attribute, guard or graft site |
| Variant | One prebuilt detached DOM tree for one combination of guard states |
| Manifest | Per-slot bind recipe (node path, prop key, binding kind) replayed on every clone |

A component can produce many shapes (for example when `props` change the structure). Each shape gets its own stencil. Stencils are keyed by `(factory, shape)`.

## Why bitwise

Each `mounted` guard is a boolean. `K` guards give `2^K` combinations. Up to `K = 5` fits in a 32-entry table, matching the "up to 32" cap. Runtime picks an entry with `mask = sum(cond_i ? 1 << i : 0)`.

```mermaid
flowchart TD
  A[instance: run factory] --> B{shape known?}
  B -- no --> C[capture: build variants 0..2^K-1]
  C --> D[store stencil + manifest]
  D --> E
  B -- yes --> E[compute guard bitmask]
  E --> F[variant = table[mask]]
  F --> G[cloneNode true]
  G --> H[replay manifest bindings]
  H --> I[graft non-cloneable slots]
  I --> J[mount]
```

Guards beyond the cap (`K > 5`) stay runtime-managed by `MountGuard` toggling. The variant only bakes the initial combination.

## Phases

### 1. Capture (first instance of a shape)

1. Walk the returned JSX. Classify every node as static, dynamic or non-cloneable.
2. Collect guards in document order, assign each a bit index. Bail to plain inflation when conditions are not boolean or when there are no benefits.
3. Build a manifest of dynamic slots.
4. For each mask build a detached variant by inflating a JSX copy where guard props are replaced by plain booleans. Inflate in a "no live bindings" mode so the snapshot stays inert.

### 2. Instantiate (following instances)

1. Factory runs, producing fresh JSX and fresh sources.
2. Match shape. On miss, capture first.
3. Pick the variant by bitmask.
4. `cloneNode(true)`.
5. Replay the manifest: bind observables, refs, handlers, styles, classes and custom attributes onto the clone using the existing `WebInflator` bind helpers.
6. Create a fresh `MountGuard` per guard so later toggles still work. The clone carries both the on-node and the placeholder.
7. Graft non-cloneable slots (raw nodes, portals, child components) at anchor comments.

The factory still runs per instance. Templating saves element creation and static property walking, not JSX creation. That is the same trade `ListReconciler` makes.

## What is non-cloneable

These must be re-inflated and spliced in, never cloned:

- Raw `Node` values in props or children (often singletons).
- Live iterables and `StateArray` children.
- Child components and any descriptor whose root is not an intrinsic tag.
- Portals (component-scoped inflators).

Same rule the list reconciler uses: no signature means no clone.

## Risks and open questions

| Risk | Note |
|---|---|
| Fresh sources per instance | Template cannot reuse captured observables. It must re-read the instance JSX by slot path. Shape signature guarantees isomorphism. |
| Ref identity | Refs must resolve to clone nodes, not template nodes. Manifest replay handles this. |
| Guard flips after mount | Clone must keep placeholder plus detached element, so `MountGuard` can still swap. |
| Value-kind drift | A prop can be static in one instance and observable in the next. Either key shapes by binding kind or let replay rebind per instance. |
| Eager 32 builds | First inflation may be heavy for big trees. Consider lazy build per mask. |
| Memory | 32 detached trees per shape per factory. WeakMap on factory keeps it collectable. |
| SSR | Out of scope. `WebInflator` client path only. |
| JSX cache | Stencils key on `(factory, shape)`. Do not rely on the per-object JSX cache for component views. |

Open questions:

- Should `this.inflators` be a new per-component registry, or an alias over `this.inflator.adapters` plus a view hook in `inflateComponent`? A separate registry avoids leaking the plugin into children, since `component.inflator` is cloned for every child.
- Lazy vs eager variant build.
- Whether the cap is 32 variants (5 guards) or a 32-bit guard count. The note reads as 32 variants.

## Naming

The name should describe the mechanism, not sell it. No `Proton` prefix, no marketing noun.

The mechanism is a truth table indexed by bits. Guards are booleans, variants are rows, the bitmask is the row index. That gives precise technical candidates:

| Name | Why |
|---|---|
| `VariantDecoder` | n-to-2^n decoder in digital logic: select bits pick one of the prebuilt outputs |
| `TruthTable` | Guard combinations are boolean rows, bitmask is row number |
| `LayoutLUT` | Bit-indexed lookup table, one table per shape |
| `ArchetypeTable` | Extends the existing `ListArchetype` term to component level |

Recommendation: `VariantDecoder` for the concept, `DecoderInflator` for the plugin class. It says exactly what it does and matches the repo's agent-noun style (`Reconciler`, `Delegator`, `Guard`).

## Implementation order

1. Add `ProtonComponent.inflators` registry and a hook in `WebInflator.inflateComponent`.
2. Extract a reusable shape signature for component views from `signatureOfDescriptor`.
3. Build the capture pass with static-only shapes (no guards), fill via manifest. Measure against deep inflation.
4. Add guard collection and the bitmask variant table.
5. Add non-cloneable graft slots.
6. Add specs mirroring `ListReconciler.spec.tsx` coverage: distinct nodes per clone, guard toggles per instance, manifest rebinding, fallback on shape miss.

## Related

- #45 Optimize component default view.
- #20 Evaluate many identical components.
- #22 Element repurposing.
- #25 Instanced components.
- #43 Map based list reconciliation.
