import { Group } from "node-group"

import { onDemandRef } from "./Inflator/web/helpers"

export class InsertionGroup extends Group {
  private placeholder = onDemandRef(() => document.createComment(this.constructor.name))

  replaceChildren(...nodes: (Node | string)[]): void {
    if (nodes.length === 0) {
      super.replaceChildren(this.placeholder.current)
    } else {
      super.replaceChildren(...nodes)
    }
  }

  parent?: ParentNode

  static readonly TAG = "insertion-group"
  static {
    if (window.customElements.get(InsertionGroup.TAG) == null) {
      window.customElements.define(InsertionGroup.TAG, InsertionGroup as never)
    }
  }
}
