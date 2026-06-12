import { describe, it, expect } from "bun:test"
import { State } from "@denshya/reactive"
import ProtonJSX, { ChildrenType } from "../src/jsx/ProtonJSX"


describe("ProtonJSX.Element", () => {
  const Element = ProtonJSX.Element

  it("returns an object with type and props", () => {
    const el = Element("div", null)
    expect(el.type).toBe("div")
    expect(el.props).toEqual({})
  })

  describe("childrenType", () => {
    it("null props gives None", () => {
      expect(Element("div", null).childrenType).toBe(ChildrenType.None)
    })

    it("missing children gives None", () => {
      expect(Element("div", {}).childrenType).toBe(ChildrenType.None)
    })

    it("undefined children gives None", () => {
      expect(Element("div", { children: undefined }).childrenType).toBe(ChildrenType.None)
    })

    it("string child gives Primitive", () => {
      expect(Element("div", { children: "hello" }).childrenType).toBe(ChildrenType.Primitive)
    })

    it("number child gives Primitive", () => {
      expect(Element("div", { children: 42 }).childrenType).toBe(ChildrenType.Primitive)
    })

    it("boolean child gives Primitive", () => {
      expect(Element("div", { children: true }).childrenType).toBe(ChildrenType.Primitive)
    })

    it("function child gives VNode", () => {
      expect(Element("div", { children: () => {} }).childrenType).toBe(ChildrenType.VNode)
    })

    it("Element child gives VNode", () => {
      const child = Element("span", null)
      expect(Element("div", { children: child }).childrenType).toBe(ChildrenType.VNode)
    })

    it("static array gives ArrayStatic", () => {
      expect(Element("div", { children: ["a", "b"] }).childrenType).toBe(ChildrenType.ArrayStatic)
    })

    it("empty array gives ArrayStatic", () => {
      expect(Element("div", { children: [] }).childrenType).toBe(ChildrenType.ArrayStatic)
    })

    it("array containing State gives ArrayReactive", () => {
      const state = new State("x")
      expect(Element("div", { children: ["a", state] }).childrenType).toBe(ChildrenType.ArrayReactive)
    })

    it("iterable (Set) gives ArrayStatic", () => {
      expect(Element("div", { children: new Set(["a", "b"]) }).childrenType).toBe(ChildrenType.ArrayStatic)
    })

    it("State as direct child gives ObservableText", () => {
      expect(Element("div", { children: new State("x") }).childrenType).toBe(ChildrenType.ObservableText)
    })
  })

  describe("all props stay in element.props", () => {
    it("contains style", () => {
      const style = { color: "red" }
      const el = Element("div", { style })
      expect(el.props.style).toBe(style)
    })

    it("contains className", () => {
      const el = Element("div", { className: "foo" })
      expect(el.props.className).toBe("foo")
    })

    it("contains class", () => {
      const el = Element("div", { class: "bar" })
      expect(el.props.class).toBe("bar")
    })

    it("contains ref", () => {
      const ref = { current: null }
      const el = Element("div", { ref })
      expect(el.props.ref).toBe(ref)
    })

    it("contains on", () => {
      const on = { click: () => {} }
      const el = Element("button", { on })
      expect(el.props.on).toBe(on)
    })

    it("contains aria", () => {
      const aria = { label: "close" }
      const el = Element("button", { aria })
      expect(el.props.aria).toBe(aria)
    })

    it("contains mounted", () => {
      const mounted = { current: false }
      const el = Element("div", { mounted })
      expect(el.props.mounted).toBe(mounted)
    })

    it("contains ns", () => {
      const el = Element("div", { ns: "http://www.w3.org/2000/svg" })
      expect(el.props.ns).toBe("http://www.w3.org/2000/svg")
    })
  })

  describe("unknown props", () => {
    it("stores unknown props alongside known", () => {
      const el = Element("a", { className: "link", href: "/", style: { color: "blue" } })
      expect(el.props).toEqual({ className: "link", href: "/", style: { color: "blue" } })
    })

    it("stores children alongside known", () => {
      const el = Element("div", { className: "x", children: "hello" })
      expect(el.props.children).toBe("hello")
      expect(el.props.className).toBe("x")
    })
  })

  describe("FragmentSymbol", () => {
    it("is a symbol", () => {
      expect(typeof ProtonJSX.FragmentSymbol).toBe("symbol")
    })

    it("is the fragment marker", () => {
      const frag = { type: ProtonJSX.FragmentSymbol, props: null }
      expect(frag.type).toBe(ProtonJSX.FragmentSymbol)
    })
  })
})


describe("JSX syntax integration", () => {
  it("creates elements via JSX transform", () => {
    const el = <div className="test">hello</div>
    expect(el.type).toBe("div")
    expect(el.props).toEqual({ className: "test", children: "hello" })
  })

  it("classifies children via JSX", () => {
    const el = <div>hello</div>
    expect(el.childrenType).toBe(ChildrenType.Primitive)
  })

  it("retains known props via JSX", () => {
    const on = { click: () => {} }
    const el = <button on={on} aria={{ label: "test" }} />
    expect(el.props.on).toBe(on)
    expect(el.props.aria).toEqual({ label: "test" })
  })

  it("retains unknown props via JSX", () => {
    const el = <div id="x" data-value="y" />
    expect(el.props).toEqual({ id: "x", "data-value": "y" })
  })

  it("creates fragments", () => {
    const frag = <><div /><span /></>
    expect(frag.type).toBe(ProtonJSX.FragmentSymbol)
    expect(frag.childrenType).toBe(ChildrenType.ArrayStatic)
  })
})
