import { State } from "@denshya/reactive"
import { describe, expect, it } from "bun:test"

import WebInflator from "@/Inflator/web/WebInflator"
import ProtonJSX from "@/jsx/ProtonJSX"


const element = ProtonJSX.Element

describe("WebInflator static-list archetype cloning", () => {
  // A static array of same-shape siblings inflates its first item as an archetype and
  // clones it for the rest. A prop only the first one declared must not ride along on
  // the clones: a disabled "Previous" once turned every button after it disabled.
  it("does not leak a bound prop onto a sibling that never declared it", () => {
    const atStart = new State(true)
    const inflator = new WebInflator

    const view = element("div", {
      children: [
        element("button", { type: "button", disabled: atStart, children: "Previous" }),
        element("button", { type: "button", children: "Confirm" }),
      ],
    } as any)

    const container = inflator.inflate(view) as HTMLElement
    const [previous, confirm] = [...container.querySelectorAll("button")] as HTMLButtonElement[]

    expect(previous.disabled).toBe(true)
    expect(confirm.disabled).toBe(false)
    expect(confirm.hasAttribute("disabled")).toBe(false)
  })

  // Separate gap, same clone path: a clone copies the archetype's rendered values but
  // none of its bindings, and `patchIntrinsic` skips a prop whose value is unchanged
  // (`value === oldValue`) on the assumption the element already carries the old binding.
  // On a clone it does not, so a reactive prop shared by same-shape siblings stays live
  // on the first item only. Fixing it means refusing reactive props in
  // `signatureOfDescriptor`, or binding clones fresh instead of diffing them.
  it.skip("rebinds a reactive prop shared by every sibling", () => {
    const atEnd = new State(false)
    const inflator = new WebInflator

    const view = element("div", {
      children: [
        element("button", { type: "button", disabled: atEnd, children: "A" }),
        element("button", { type: "button", disabled: atEnd, children: "B" }),
      ],
    } as any)

    const container = inflator.inflate(view) as HTMLElement
    const buttons = [...container.querySelectorAll("button")] as HTMLButtonElement[]
    expect(buttons.map(button => button.disabled)).toEqual([false, false])

    atEnd.set(true)
    expect(buttons.map(button => button.disabled)).toEqual([true, true])
  })
})
