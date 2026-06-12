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


const KNOWN_PROPS = new Set([
  "children", "ns", "ref", "className", "class", "style", "on", "aria", "mounted"
])

/** @internal */
namespace ProtonJSX {
  type Props = Record<keyof never, unknown> & JSX.CustomAttributes & { children?: Children }
  type Children = (Node | Primitive) | (Node | Primitive)[]

  export function Element(type: keyof never | Function | Node, rawProps: Props | null) {
    const element: JSX.Element & Record<string, any> = { type, props: {} }
    const props = rawProps as Record<string, any> | null ?? {}

    element.childrenType = classifyChildren(props.children)

    // Extract known props for direct access during inflation — eliminates for...in loop overhead
    if (props.style != null) element.style = props.style
    if (props.className != null) element.className = props.className
    if (props.class != null) element.class = props.class
    if (props.ref != null) element.ref = props.ref
    if (props.on != null) element.on = props.on
    if (props.aria != null) element.aria = props.aria
    if (props.mounted != null) element.mounted = props.mounted
    if (props.ns != null) element.ns = props.ns

    // Unknown props + children go into props (children accessed by inflateJSXChildren)
    for (const key in props) {
      if (key !== "children" && KNOWN_PROPS.has(key)) continue

      element.props[key] = props[key]
    }

    return element
  }
  export const FragmentSymbol = Symbol.for("Tama.Fragment")
}

export default ProtonJSX
