import { describe, it, expect, beforeEach } from "bun:test"
import { WebInflator } from "../build"

import { State, StateArray } from "@denshya/reactive"


describe("WebInflator", () => {
  let inflator: WebInflator

  beforeEach(() => {
    inflator = new WebInflator
    document.body.replaceChildren()
  })

  it("inflates primitives to Text nodes", () => {
    function expectTextNode(subject: unknown) {
      const node = inflator.inflate(subject)
      expect(node.nodeType).toBe(Node.TEXT_NODE)
      expect(node.textContent).toBe(String(subject))
    }

    expectTextNode(123)
    expectTextNode(123n)
    expectTextNode("123")
    expectTextNode(true)
    expectTextNode(Symbol.for("subscribe"))
  })

  it("inflates intrinsic JSX elements", () => {
    const element = inflator.inflate(<div className="cls">Hello</div>)

    expect(element.tagName).toBe("DIV")
    expect(element.className).toBe("cls")
    expect(element.textContent).toBe("Hello")
  })

  it("inflates fragments and arrays", () => {
    const frag1 = inflator.inflate(<>A<span>B</span>C</>) as unknown as DocumentFragment
    expect([...frag1.childNodes].map(n => n.textContent)).toEqual(["A", "B", "C"])

    const frag2 = inflator.inflate(["X", <em>Y</em>])
    expect([...frag2.childNodes].map(n => n.textContent)).toEqual(["X", "Y"])
  })

  it("inflates iterable", () => {
    const fragment = inflator.inflate(new Set(["X", <em>Y</em>]))
    expect([...fragment.childNodes].map(n => n.textContent)).toEqual(["X", "Y"])
  })

  it("inflates observable", () => {
    const state = new State("test")

    const text = inflator.inflate(state) as Text
    expect(text.textContent).toBe("test")

    state.set("new")
    expect(text.textContent).toBe("new")
  })

  it("inflates observable iterable", () => {
    const stateIterable = new State(new Set(["test", <em>oh my guy</em>]))

    const group = inflator.inflate(stateIterable)
    expect([...group.childNodes].map(n => n.textContent)).toEqual(["test", "oh my guy"])

    stateIterable.set(new Set(["new", <em>oh yes</em>]))
    expect([...group.childNodes].map(n => n.textContent)).toEqual(["new", "oh yes"])
  })
  it("inflates iterable+observable", () => {
    const stateIterable = new StateArray(["test", <em>oh my guy</em>])

    const div = inflator.inflate(<div>{stateIterable}</div>)
    document.body.appendChild(div)

    expect([...div.childNodes].map(n => n.textContent)).toEqual(["test", "oh my guy"])

    stateIterable.set(["new", <em>oh yes</em>])
    expect([...div.childNodes].map(n => n.textContent)).toEqual(["new", "oh yes"])
  })
  it("inflates observable jsx", () => {
    const parent = inflator.inflate(<div />)

    const jsx = new State(<div />)
    const element = inflator.inflate(jsx)
    parent.append(element)

    expect(parent.children[0]).toBeInstanceOf(HTMLDivElement)
    expect(element).toBeInstanceOf(HTMLDivElement)

    jsx.set(<p />)
    expect(parent.children[0]).toBeInstanceOf(HTMLParagraphElement)

    jsx.set(<a />)
    expect(parent.children[0]).toBeInstanceOf(HTMLAnchorElement)
  })
  it("throws on async iterable input", () => {
    async function* gen() { yield 1; }
    expect(() => inflator.inflate(gen())).toThrow(TypeError)
  })

  it("inflates async iterable component", async () => {
    const one = Promise.withResolvers()
    const two = Promise.withResolvers()
    const three = Promise.withResolvers()

    async function* AsyncComponent() {
      yield <span>One</span>
      await one.promise

      yield <span>Two</span>
      await two.promise

      yield <span>Three</span>
      await three.promise

      return <span>Return</span>
    }

    const group = inflator.inflate(<AsyncComponent />)
    expect(group.firstChild).toBeInstanceOf(Comment)

    const container = document.createElement('div')
    container.append(group)

    document.body.append(container)



    let spans = container.querySelectorAll('span')
    expect(spans.length).toBe(0)

    await window.happyDOM.whenAsyncComplete()

    spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe('One')

    one.resolve()
    await window.happyDOM.whenAsyncComplete()

    spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe('Two')

    two.resolve()
    await window.happyDOM.whenAsyncComplete()

    spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe('Three')

    three.resolve()
    await window.happyDOM.whenAsyncComplete()

    spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe('Return')
  })

  it("inflates sync/async components", async () => {
    function Sync() { return <p>S</p>; }
    async function Async() { return <p>A</p>; }

    const sync = inflator.inflate(<Sync />) as unknown as DocumentFragment
    expect(sync.textContent).toBe("S")

    const async = inflator.inflate(<Async />) as unknown as DocumentFragment
    await new Promise(r => setTimeout(r, 0))
    expect(async.textContent).toBe("A")
  })

  it("gracefully shuts down on error in component", () => {
    const ComponentErrored = () => { throw new Error("test") }

    expect(() => inflator.inflate(<ComponentErrored />)).toThrow()
  })

  it("inflates nested components deeply", async () => {
    function Comp() { return <strong>Deep</strong> }

    const element = inflator.inflate(<div><Comp /></div>) as HTMLElement
    document.body.append(element)

    expect(element.querySelector("strong")?.textContent).toBe("Deep")
  })

  it("creates SVGUse with href", () => {
    const svg = inflator.inflate(<use href={new State("123")} />) as SVGUseElement
    expect(svg.getAttribute("href")).toBe("123")
  })

  it("sets static className on SVG elements via setAttribute", () => {
    const circle = inflator.inflate(<circle className="my-cls" />) as SVGCircleElement
    expect(circle.getAttribute("class")).toBe("my-cls")
  })

  it("sets reactive className on SVG elements via setAttribute", () => {
    const cls = new State("foo")
    const circle = inflator.inflate(<circle className={cls} />) as SVGCircleElement
    expect(circle.getAttribute("class")).toBe("foo")
    cls.set("bar")
    expect(circle.getAttribute("class")).toBe("bar")
  })

  it("sets static className on HTML elements via .className", () => {
    const div = inflator.inflate(<div className="my-cls" />) as HTMLDivElement
    expect(div.className).toBe("my-cls")
    expect(div.getAttribute("class")).toBe("my-cls")
  })

  it("sets reactive className on HTML elements via .className", () => {
    const cls = new State("foo")
    const div = inflator.inflate(<div className={cls} />) as HTMLDivElement
    expect(div.className).toBe("foo")
    cls.set("bar")
    expect(div.className).toBe("bar")
  })

  it("binds multiple event listener sources from arrays", () => {
    const events: string[] = []

    const feature = {
      listeners: {
        click: () => events.push("feature:click"),
        hover: () => events.push("feature:hover"),
      },
    }

    const element = inflator.inflate(
      <div on={[feature.listeners, { hover: () => events.push("extra:hover") }]} />
    ) as HTMLElement

    document.body.append(element)

    element.dispatchEvent(new Event("click", { bubbles: true }))
    element.dispatchEvent(new Event("hover"))

    expect(events).toEqual(["feature:click", "feature:hover", "extra:hover"])
  })

  // it("creates SVG and MathML in correct namespace", () => {
  //   const svg = inflator.inflate(<svg><circle /></svg>) as SVGSVGElement
  //   expect(svg.namespaceURI).toContain("svg")
  //   expect(svg.querySelector("circle")!.namespaceURI).toContain("svg")

  //   const math = inflator.inflate(<math><mi /></math>) as Element
  //   expect(math.namespaceURI).toContain("mathml")
  // })

  // it("errors on invalid intrinsic types", () => {})

  it("binds data-, aria-, and boolean attributes", () => {
    const input = inflator.inflate(<input disabled data-test="d" aria-label="a" />) as HTMLInputElement

    expect(input.disabled).toBe(true)
    expect(input.getAttribute("data-test")).toBe("d")
    expect(input.getAttribute("aria-label")).toBe("a")
  })

  it("binds observable style string and reacts to changes", () => {
    const styleState = new State("color: red")

    const element = inflator.inflate(<div style={styleState} />) as HTMLElement
    expect(element.style.color).toBe("red")

    styleState.set("color: blue")
    expect(element.style.color).toBe("blue")
  })

  it("binds observable style object property and reacts to changes", () => {
    const color = new State("red")

    const element = inflator.inflate(<div style={{ color }} />) as HTMLElement
    expect(element.style.color).toBe("red")

    color.set("blue")
    expect(element.style.color).toBe("blue")
  })

  // it("binds observable style object and reacts to changes", () => {
  //   const styleState = new State({ color: "red" })

  //   const element = inflator.inflate(<div style={styleState} />) as HTMLElement
  //   expect(element.style.color).toBe("red")

  //   styleState.set({ color: "blue" })
  //   expect(element.style.color).toBe("blue")
  // })

  it("attaches multiple event listeners and preserves native behavior", () => {
    let clicked = false
    let hovered = false

    const button = inflator.inflate(
      <button on={{ click: () => clicked = true, mouseover: () => hovered = true }} />
    ) as HTMLButtonElement

    document.body.append(button)
    button.click()
    button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }))
    button.remove()

    expect(clicked).toBe(true)
    expect(hovered).toBe(true)
  })

  it("guarded mount/unmount toggles DOM presence and handles rapid toggles", () => {
    document.body.innerHTML = "<div id='root' />"

    const mounted = new State(false)
    const placeholder = inflator.inflate(<span mounted={mounted}>X</span>)
    const root = document.getElementById("root")!
    root.append(placeholder)

    // rapid toggle
    for (let i = 0; i < 5; i++) mounted.set(i % 2 === 0)
    const spans = root.querySelectorAll("span")
    expect(spans.length).toBeLessThanOrEqual(1)

    // final true mount
    mounted.set(true)
    expect(root.querySelector("span")?.textContent).toBe("X")
    // final false unmount
    mounted.set(false)
    expect(root.querySelector("span")).toBeNull()
  })

  it("applies custom jsxAttributes overrides (as element object property)", () => {
    inflator.jsxAttributes.set("foo" as never, context => context.bind("foo", context.value + "-ok"))
    // @ts-expect-error
    const element = inflator.inflate(<div foo="bar" />)
    expect(element["foo" as never]).toBe("bar-ok" as never)
  })

  it("inflates custom element", () => {
    class CustomDiv extends HTMLDivElement { }
    window.customElements.define("custom-div", CustomDiv)

    // @ts-expect-error
    const inflatedCustomDiv = inflator.inflate(<custom-div />)
    expect(inflatedCustomDiv).toBeInstanceOf(CustomDiv)
  })

  it("caches inflate result for same jsx", () => {
    const jsx = <div />

    const inflated1 = inflator.inflate(jsx)
    const inflated2 = inflator.inflate(jsx)

    expect(inflated1).toBe(inflated2)

    expect(inflator.inflate(1)).not.toBe(inflator.inflate(1))
  })

  it("creates element with multiple static attributes via HTML string", () => {
    const el = inflator.inflate(<div id="test" data-index="42" hidden />) as HTMLElement
    expect(el.id).toBe("test")
    expect(el.getAttribute("data-index")).toBe("42")
    expect(el.hidden).toBe(true)
  })

  it("merges static HTML attrs with reactive attrs", () => {
    const title = new State("hello")
    const el = inflator.inflate(<div id="static" title={title} />) as HTMLElement
    expect(el.id).toBe("static")
    expect(el.title).toBe("hello")
    title.set("world")
    expect(el.title).toBe("world")
  })

  it("inflates reactive iterable that starts empty then receives items", () => {
    const items = new StateArray<string | JSX.Element>([])
    const div = inflator.inflate(<div>{items}</div>) as HTMLElement
    document.body.append(div)

    expect(div.childNodes.length).toBe(0)

    items.set(["a", "b", "c"])
    expect(div.childNodes.length).toBe(3)
    expect([...div.childNodes].map(n => n.textContent)).toEqual(["a", "b", "c"])
  })

  it("stops delegated event propagation when cancelBubble is set", () => {
    const outerEvents: string[] = []
    const innerEvents: string[] = []

    const outer = inflator.inflate(
      <div on={{ click: () => outerEvents.push("outer") }} />
    ) as HTMLElement
    const inner = inflator.inflate(
      <div on={{ click: (e: Event) => { innerEvents.push("inner"); e.stopPropagation() } }} />
    ) as HTMLElement

    outer.append(inner)
    document.body.append(outer)

    inner.dispatchEvent(new Event("click", { bubbles: true }))

    expect(innerEvents).toEqual(["inner"])
    expect(outerEvents).toEqual([])
  })
})
