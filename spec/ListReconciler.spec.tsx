import { describe, it, expect, beforeEach } from "bun:test"
import { WebInflator } from "../build"

import { State, StateArray, StateReconciler } from "@denshya/reactive"


describe("ListReconciler", () => {
  let inflator: WebInflator

  beforeEach(() => {
    inflator = new WebInflator
    document.body.replaceChildren()
  })

  it("keeps DOM nodes of identical items on update", () => {
    const row1 = <li>one</li>
    const row2 = <li>two</li>
    const list = new StateArray([row1, row2])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const firstBefore = ul.children[0]

    list.set([row1])

    expect(ul.children.length).toBe(1)
    expect(ul.children[0]).toBe(firstBefore)
    expect(ul.children[0].textContent).toBe("one")

    list.set([row1, row2])

    expect(ul.children.length).toBe(2)
    expect(ul.children[0]).toBe(firstBefore) // The survivor keeps its node.
    expect(ul.children[1].textContent).toBe("two") // The re-added item renders fresh.
  })

  it("appends only the new items", () => {
    const row1 = <li>one</li>
    const row2 = <li>two</li>
    const list = new StateArray([row1, row2])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const firstBefore = ul.children[0]
    const secondBefore = ul.children[1]

    list.set([row1, row2, <li>three</li>])

    expect(ul.children.length).toBe(3)
    expect(ul.children[0]).toBe(firstBefore)
    expect(ul.children[1]).toBe(secondBefore)
    expect(ul.children[2].textContent).toBe("three")
  })

  it("patches a replaced item in place", () => {
    const row1 = <li>one</li>
    const row3 = <li>three</li>
    const list = new StateArray([row1, <li>two</li>, row3])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const middleBefore = ul.children[1]

    list.set([row1, <li>two-patched</li>, row3])

    expect(ul.children.length).toBe(3)
    expect(ul.children[1]).toBe(middleBefore)
    expect(ul.children[1].textContent).toBe("two-patched")
  })

  it("rebuilds a position on shape mismatch", () => {
    const row1 = <li>one</li>
    const list = new StateArray([row1, <li>two</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const middleBefore = ul.children[1]

    list.set([row1, <div>two-div</div>])

    expect(ul.children[1]).not.toBe(middleBefore)
    expect(ul.children[1].tagName).toBe("DIV")
    expect(ul.children[1].textContent).toBe("two-div")
  })

  it("stops bindings of removed items", () => {
    const state = new State("a")
    const removable = <li className={state}>x</li>
    const list = new StateArray([removable])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const removed = ul.children[0] as HTMLElement
    expect(removed.className).toBe("a")

    list.set([])
    state.set("b")

    expect(removed.className).toBe("a") // Frozen — the binding was released.
  })

  it("gives duplicated items distinct nodes", () => {
    const item = <li>dup</li>
    const list = new StateArray([item, item])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    expect(ul.children.length).toBe(2)
    expect(ul.children[0]).not.toBe(ul.children[1])
    expect(ul.children[0].textContent).toBe("dup")
    expect(ul.children[1].textContent).toBe("dup")
  })

  it("patches arrow components and rebinds their children states", () => {
    const Row = (props: { label: State<string> }) => <tr class="row"><td>{props.label}</td></tr>

    const label1 = new State("one")
    const label2 = new State("two")
    const list = new StateArray([<Row label={label1} />])

    const table = inflator.inflate(<table><tbody>{list}</tbody></table>) as HTMLElement
    document.body.append(table)

    const tbody = table.querySelector("tbody")!
    const rowBefore = tbody.children[0]

    list.set([<Row label={label2} />])

    expect(tbody.children[0]).toBe(rowBefore)
    expect(rowBefore.textContent).toBe("two")

    // The old label no longer feeds the row.
    label1.set("zombie")
    expect(rowBefore.textContent).toBe("two")

    // Fine-grained updates still flow through the reconciled row.
    label2.set("two!")
    expect(rowBefore.textContent).toBe("two!")
  })

  it("rebinds event handlers on patch", () => {
    const clicks: string[] = []
    const list = new StateArray([<button on={{ click: () => clicks.push("old") }}>x</button>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const buttonBefore = ul.children[0] as HTMLElement
    buttonBefore.click()
    expect(clicks).toEqual(["old"])

    list.set([<button on={{ click: () => clicks.push("new") }}>x</button>])

    expect(ul.children[0]).toBe(buttonBefore)
    buttonBefore.click()
    expect(clicks).toEqual(["old", "new"])
  })

  it("clears and refills a list in order", () => {
    const list = new StateArray([<li>1</li>, <li>2</li>, <li>3</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    list.set([])
    expect(ul.children.length).toBe(0)

    list.set([<li>a</li>, <li>b</li>])
    expect([...ul.children].map(child => child.textContent)).toEqual(["a", "b"])
  })

  it("renders through a reconciled map without re-running surviving predicates", () => {
    const rows = new StateArray<{ id: number, label: State<string> }>([])
    rows.reconciler = StateReconciler.IDENTITY
    let renders = 0

    const views = rows.map(row => {
      renders++
      return <li>{row.label}</li>
    })

    const ul = inflator.inflate(<ul>{views}</ul>) as HTMLElement
    document.body.append(ul)

    const items = [{ id: 1, label: new State("a") }, { id: 2, label: new State("b") }]
    rows.set(items)

    expect(renders).toBe(2)
    expect([...ul.children].map(child => child.textContent)).toEqual(["a", "b"])

    rows.set([items[0]])

    expect(renders).toBe(2) // The predicate did not re-run for the survivor.
    expect(ul.children.length).toBe(1)
    expect(ul.children[0].textContent).toBe("a")

    // Fine-grained updates keep flowing.
    items[0].label.set("a2")
    expect(ul.children[0].textContent).toBe("a2")
  })
})
