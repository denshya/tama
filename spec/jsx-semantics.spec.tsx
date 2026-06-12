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

  describe("known prop extraction", () => {
    it("extracts style to top-level", () => {
      const style = { color: "red" }
      const el = Element("div", { style })
      expect(el.style).toBe(style)
      expect(el.props).not.toHaveProperty("style")
    })

    it("extracts className to top-level", () => {
      const el = Element("div", { className: "foo" })
      expect(el.className).toBe("foo")
      expect(el.props).not.toHaveProperty("className")
    })

    it("extracts class to top-level", () => {
      const el = Element("div", { class: "bar" })
      expect(el.class).toBe("bar")
      expect(el.props).not.toHaveProperty("class")
    })

    it("extracts ref to top-level", () => {
      const ref = { current: null }
      const el = Element("div", { ref })
      expect(el.ref).toBe(ref)
      expect(el.props).not.toHaveProperty("ref")
    })

    it("extracts on to top-level", () => {
      const on = { click: () => {} }
      const el = Element("button", { on })
      expect(el.on).toBe(on)
      expect(el.props).not.toHaveProperty("on")
    })

    it("extracts aria to top-level", () => {
      const aria = { label: "close" }
      const el = Element("button", { aria })
      expect(el.aria).toBe(aria)
      expect(el.props).not.toHaveProperty("aria")
    })

    it("extracts mounted to top-level", () => {
      const mounted = { current: false }
      const el = Element("div", { mounted })
      expect(el.mounted).toBe(mounted)
      expect(el.props).not.toHaveProperty("mounted")
    })

    it("extracts ns to top-level", () => {
      const el = Element("div", { ns: "http://www.w3.org/2000/svg" })
      expect(el.ns).toBe("http://www.w3.org/2000/svg")
    })

    it("skips null known props", () => {
      const el = Element("div", { className: null, style: null, ref: null })
      expect(el.className).toBeUndefined()
      expect(el.style).toBeUndefined()
      expect(el.ref).toBeUndefined()
    })

    it("skips undefined known props", () => {
      const el = Element("div", { className: undefined })
      expect(el.className).toBeUndefined()
    })
  })

  describe("unknown prop pass-through", () => {
    it("stores unknown props in element.props", () => {
      const el = Element("div", { id: "main", title: "hi" })
      expect(el.props).toEqual({ id: "main", title: "hi" })
    })

    it("stores children in element.props", () => {
      const el = Element("div", { children: "hello" })
      expect(el.props).toHaveProperty("children", "hello")
    })

    it("keeps ns out of element.props (extracted to top-level)", () => {
      const el = Element("div", { ns: "http://www.w3.org/2000/svg" })
      expect(el.ns).toBe("http://www.w3.org/2000/svg")
      expect(el.props).toEqual({})
    })

    it("mixes known and unknown props correctly", () => {
      const el = Element("a", { className: "link", href: "/", style: { color: "blue" } })
      expect(el.className).toBe("link")
      expect(el.style).toEqual({ color: "blue" })
      expect(el.props).toEqual({ href: "/" })
    })

    it("sets props to empty when only known props are given", () => {
      const el = Element("div", { className: "foo", style: { color: "red" } })
      expect(el.props).toEqual({})
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
    expect(el.className).toBe("test")
    expect(el.props).toEqual({ children: "hello" })
  })

  it("classifies children via JSX", () => {
    const el = <div>hello</div>
    expect(el.childrenType).toBe(ChildrenType.Primitive)
  })

  it("extracts known props via JSX", () => {
    const on = { click: () => {} }
    const el = <button on={on} aria={{ label: "test" }} />
    expect(el.on).toBe(on)
    expect(el.aria).toEqual({ label: "test" })
    expect(el.props).toEqual({})
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
