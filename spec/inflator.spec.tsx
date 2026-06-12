import { beforeEach, describe, expect, it } from "bun:test"
import { WebInflator } from "../build"

import { State } from "@denshya/reactive"



/**
 * JSDoc for `describe` function.
 */
describe("WebInflator", () => {
  const inflator = new WebInflator

  /**
   * JSDoc for `it` function.
   */
  it("should inflate basic JSX element", () => {
    const element = inflator.inflate(<div className="test">Hello</div>)

    expect(element.tagName).toBe("DIV")
    expect(element.className).toBe("test")
    expect(element.textContent).toBe("Hello")
  })

  it("should bind State to JSX attributes and update on change", () => {
    const state = new State("foo")
    const element = inflator.inflate(<div id={state} />)

    expect(element.id).toBe("foo")
    state.set("bar")
    expect(element.id).toBe("bar")
  })

  it("should bind event handlers", () => {
    let clicked = false

    const button = inflator.inflate(<button on={{ click: () => { clicked = true } }}>Click</button>) as HTMLButtonElement
    document.body.append(button)
    button.click()
    button.remove()

    expect(clicked).toBe(true)
  })
})

describe("Conditional Rendering (mounted)", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='root'>"
  })

  const inflator = new WebInflator

  it("should not append element when mounted is false", () => {
    const mounted = new State(false)

    const view = inflator.inflate(<span mounted={mounted}>Hidden</span>)
    const root = document.getElementById("root")!
    root.append(view)

    expect(root.querySelector("span")?.textContent).toBeUndefined()
  })

  it("should append element when mounted becomes true", () => {
    const mounted = new State(false)

    const view = inflator.inflate(<span mounted={mounted}>Visible</span>)
    const root = document.getElementById("root")!

    root.append(view)
    mounted.set(true)

    expect(root.querySelector("span")?.textContent).toBe("Visible")
  })

    it("should ignore properties without `subscribe`", () => {
    const noSubscribe = { get: () => "asd" }

    const view = inflator.inflate(<span className={noSubscribe} mounted={noSubscribe}>Visible</span>)
    const root = document.getElementById("root")!
    root.append(view)

    expect(root.querySelector("span")?.textContent).toBe("Visible")
  })
})
