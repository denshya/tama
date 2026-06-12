import { describe, it, expect } from "bun:test"

import { InsertionGroup } from "@/InsertionGroup"



describe("InsertionGroup", () => {
  it("should be defined in customElements", () => {
    expect(customElements.getName(InsertionGroup)).toBe(InsertionGroup.TAG)
  })
})
