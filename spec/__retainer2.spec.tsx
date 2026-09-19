import { describe, it, expect } from "bun:test"
import { WebInflator } from "../build"
import { State, StateArray, StateReconciler } from "@denshya/reactive"

// Verbatim benchmark-app structure.
interface RowItemStateful { id: State<number>, label: State<string> }

describe("retainer trace 2 — real Row", () => {
  it("shared-state cycles with the real Row component", async () => {
    const rows = new StateArray<RowItemStateful>([])
    const selected = new State<number | null>(null)

    const onRemove = (id: number) => rows.set(rows.get().filter(row => row.id.get() !== id))

    rows.reconciler = StateReconciler.IDENTITY
    const rowViews = rows.map(row => Row({ item: row, selected, onRemove }))

    const inflator = new WebInflator()
    const container = inflator.inflate(<table><tbody>{rowViews}</tbody></table>) as HTMLElement
    document.body.append(container)

    const probes: { ref: WeakRef<object> }[] = []

    for (let cycle = 0; cycle < 5; cycle++) {
      const items = Array.from({ length: 1000 }, (_, i) => {
        const marker = { tag: `MARKER-c${cycle}-i${i}` }
        probes.push({ ref: new WeakRef(marker) })
        return { id: new State(i + 1), label: new State(`label ${i}`), marker }
      })
      rows.set(items)
      rows.set([])
    }

    Bun.gc(true); Bun.gc(true)
    const alive = probes.filter(p => p.ref.deref() != null)
    console.log("MARKERS ALIVE:", alive.length, "of", probes.length)
    if (alive.length > 0) {
      console.log("first alive tags:", alive.slice(0, 3).map(p => (p.ref.deref() as any).tag))
    }
    expect(alive.length).toBeLessThan(50)
  })
})

function Row(props: { item: RowItemStateful & { marker: object }, selected: State<number | null>, onRemove(id: number): void }) {
  return (
    <tr className={props.selected.to(id => id === props.item.id.get() ? "danger" : "")}>
      <td className="col-md-1">{props.item.id}</td>
      <td className="col-md-4">
        <a on={{ click: () => props.selected.copy(props.item.id) }}>{props.item.label}</a>
      </td>
      <td className="col-md-1">
        <a on={{ click: () => props.onRemove(props.item.id.get()) }}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  )
}
