import { onDemandRef, truthyNonNull } from "./Inflator/web/helpers"


/** @internal */
export class MountGuard {
  private readonly properties = new Set<object>()
  private readonly guards = new Set<object>()
  public readonly placeholder = onDemandRef(() => document.createComment(this.constructor.name))

  constructor(private readonly element: ChildNode) { }

  private toggleMount(condition: unknown) {
    const placeholder = this.placeholder.current

    const source = condition ? placeholder : this.element
    const target = condition ? this.element : placeholder

    if (source?.parentElement == null) return
    source.replaceWith(target)
  }

  for(property: { valid: Function, subscribe: Function, get?: Function }) {
    if (this.properties.has(property)) return
    this.properties.add(property)

    property.subscribe((value: any) => {
      const valid = property.valid?.(value)
      if (valid) {
        this.guards.add(property)
      } else {
        this.guards.delete(property)
      }

      this.toggleMount(this.guards.size >= this.properties.size)
    })
  }

  static is(property: { valid?: Function, subscribe?: Function, get?: Function }) {
    if (property == null) return false
    if (typeof property !== "object") return false

    // if (key === "mounted" && property.valid == null) property.valid = truthyNonNull

    if (typeof property.valid !== "function") return false
    if (property.subscribe == null) return false

    return true
  }

  static truthy(property: { valid: Function, subscribe?: Function, get?: Function }) {
    if (property.valid(property.get?.() ?? property.valueOf()) === false) {
      return true
    }

    return false
  }
}
