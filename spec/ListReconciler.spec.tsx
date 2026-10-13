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

  it("bulk-removes a large list without touching surrounding nodes", () => {
    const list = new StateArray(Array.from({ length: 40 }, (_, index) => <li>{index}</li>))

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    // Surrounding nodes outside the list region must survive the bulk removal.
    const head = document.createElement("li")
    head.textContent = "head"
    const tail = document.createElement("li")
    tail.textContent = "tail"
    ul.prepend(head)
    ul.append(tail)

    list.set([])
    expect(ul.children.length).toBe(2)
    expect(ul.children[0].textContent).toBe("head")
    expect(ul.children[1].textContent).toBe("tail")

    list.set([<li>fresh</li>])
    expect([...ul.children].map(child => child.textContent)).toEqual(["head", "fresh", "tail"])
  })

  it("releases bindings of bulk-removed records", () => {
    const className = new State("on")
    const list = new StateArray(Array.from({ length: 40 }, (_, index) => <li className={className}>{index}</li>))

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)
    expect(ul.children[0].className).toBe("on")

    const detached = [...ul.children] as HTMLElement[]
    list.set([])

    className.set("off")
    // Every bulk-removed row was released — none follows the state anymore.
    for (const row of detached) expect(row.className).toBe("on")
    expect(ul.children.length).toBe(0)
  })

  it("bulk-removes inside a group parent", () => {
    const list = new StateArray(Array.from({ length: 40 }, (_, index) => <span>{index}</span>))

    const group = inflator.inflate(list) as HTMLElement
    document.body.append(group)
    expect(group.textContent!.length).toBeGreaterThan(0)

    list.set([])
    expect(group.textContent).toBe("")

    list.set([<span>one</span>, <span>two</span>])
    expect(group.textContent).toBe("onetwo")
  })

  it("clones same-shape items with their own static content", () => {
    const list = new StateArray([<li>first</li>, <li>second</li>, <li>third</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    // Items two and three are archetype clones — static differences must be written.
    expect([...ul.children].map(child => child.textContent)).toEqual(["first", "second", "third"])
  })

  it("cloned items carry live bindings of their own sources", () => {
    const label1 = new State("one")
    const label2 = new State("two")
    const list = new StateArray([<li>{label1}</li>, <li>{label2}</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    expect([...ul.children].map(child => child.textContent)).toEqual(["one", "two"])

    label2.set("two!")
    expect(ul.children[1].textContent).toBe("two!")

    // The archetype-derived clone of row one still tracks only its own source.
    label1.set("one!")
    expect(ul.children[0].textContent).toBe("one!")
    expect(ul.children[1].textContent).toBe("two!")
  })

  it("cloned items bind their own event handlers", () => {
    const clicks: string[] = []
    const list = new StateArray([
      <button on={{ click: () => clicks.push("a") }}>a</button>,
      <button on={{ click: () => clicks.push("b") }}>b</button>,
    ])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    const first = ul.children[0] as HTMLElement
    const second = ul.children[1] as HTMLElement
    expect(second).not.toBe(first) // Distinct nodes, same shape — the second is a clone.

    first.click()
    second.click()
    expect(clicks).toEqual(["a", "b"])
  })

  it("falls back to full inflation across shapes and keeps archetypes per shape", () => {
    const list = new StateArray([<li>x</li>, <div>y</div>, <li>z</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    expect([...ul.children].map(child => child.tagName + ":" + child.textContent)).toEqual([
      "LI:x", "DIV:y", "LI:z",
    ])
  })

  it("does not clone guarded items", () => {
    const mounted1 = new State(true)
    const mounted2 = new State(true)
    const list = new StateArray([
      <li mounted={mounted1}>one</li>,
      <li mounted={mounted2}>two</li>,
    ])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    expect(ul.children.length).toBe(2)
    expect([...ul.children].map(child => child.textContent)).toEqual(["one", "two"])

    // Toggling either guard only affects its own row.
    mounted1.set(false)
    expect(ul.children.length).toBe(1)
    expect(ul.children[0].textContent).toBe("two")
  })

  it("releases bindings acquired only during patch", () => {
    const label = new State("bound")
    const list = new StateArray([<li>plain</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    // The patch binds the row's text to `label` — a binding the record did not have at creation.
    list.set([<li>{label}</li>])
    const row = ul.children[0] as HTMLElement
    expect(row.textContent).toBe("bound")

    list.set([])
    label.set("changed")
    expect(row.textContent).toBe("bound") // Released on destroy — frozen.
    expect(ul.children.length).toBe(0)
  })

  it("releases bindings of records containing a live inner list", () => {
    const outer = new StateArray([
      { id: "a", items: new StateArray([<span>a1</span>]) },
      { id: "b", items: new StateArray([<span>b1</span>]) },
    ])

    const ul = inflator.inflate(<ul>{outer.map(entry => <li>{entry.items}</li>)}</ul>) as HTMLElement
    document.body.append(ul)

    expect([...ul.querySelectorAll("span")].map(span => span.textContent)).toEqual(["a1", "b1"])

    // Grow the inner lists AFTER creation — runtime-acquired bindings the record's
    // create-time bound set cannot know about.
    outer.get()[0].items.set([<span>a1</span>, <span>a2</span>])
    expect([...ul.querySelectorAll("span")].map(span => span.textContent)).toEqual(["a1", "a2", "b1"])

    const detachedSpans = [...ul.querySelectorAll("span")] as HTMLElement[]
    outer.set([])

    expect(ul.querySelectorAll("span").length).toBe(0)
    // The inner spans were released through the fallback walk — content stays frozen.
    for (const span of detachedSpans) expect(span.textContent!.length).toBeGreaterThan(0)
  })

  it("reuses pooled records correctly across clear and refill", () => {
    const first = new State("one")
    const second = new State("two")
    const list = new StateArray([<li>{first}</li>])

    const ul = inflator.inflate(<ul>{list}</ul>) as HTMLElement
    document.body.append(ul)

    list.set([<li>{second}</li>]) // Patch.
    list.set([]) // Destroy — record and bound set recycle.
    list.set([<li>fresh</li>]) // Create — pops the recycled record.

    expect(ul.children.length).toBe(1)
    expect(ul.children[0].textContent).toBe("fresh")

    // The recycled record must carry only the new binding: the old state no longer reaches it.
    first.set("GHOST")
    second.set("GHOST")
    expect(ul.children[0].textContent).toBe("fresh")
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
