import { Primitive } from "type-fest"


export enum ChildrenType {
  None = 0,
  Primitive = 1,
  VNode = 2,
  ArrayStatic = 3,
  ArrayReactive = 4,
  ObservableText = 5,
  ObservableIterable = 6,
}

function classifyChildren(children: unknown): ChildrenType {
  if (children == null) return ChildrenType.None

  if (typeof children !== "object" || children === null) {
    switch (typeof children) {
      case "function": return ChildrenType.VNode
      default: return ChildrenType.Primitive
    }
  }

  if (children instanceof Object && (children as any).type != null && !Array.isArray(children)) {
    return ChildrenType.VNode
  }

  if (Array.isArray(children)) {
    for (const child of children) {
      if (child != null && typeof child === "object" && (child as any).subscribe instanceof Function) {
        return ChildrenType.ArrayReactive
      }
    }
    return ChildrenType.ArrayStatic
  }

  if (children instanceof Object && Symbol.iterator in children) {
    return ChildrenType.ArrayStatic
  }

  if ((children as any).subscribe instanceof Function) {
    return ChildrenType.ObservableText
  }

  return ChildrenType.VNode
}


/** @internal */
namespace ProtonJSX {
  type Props = Record<keyof never, unknown> & JSX.CustomAttributes & { children?: Children }
  type Children = (Node | Primitive) | (Node | Primitive)[]

  export function Element(type: keyof never | Function | Node, props: Props | null) {
    const element: JSX.Element = { type, props }
    element.childrenType = classifyChildren(props?.children)
    return element
  }
  export const FragmentSymbol = Symbol.for("Tama.Fragment")
}

export default ProtonJSX
