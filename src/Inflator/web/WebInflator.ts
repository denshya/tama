import { State } from "@denshya/reactive"
import { Group } from "node-group"
import { Primitive } from "type-fest"

import { AccessorGet } from "@/Accessor"
import { AsyncFunction, AsyncGeneratorFunction } from "@/BuiltinObjects"
import { Disposal } from "@/Disposal"
import { InsertionGroup } from "@/InsertionGroup"
import { CustomAttributesMap, JSXAttributeSetup } from "@/jsx/JSXCustomizationAPI"
import { MountGuard } from "@/MountGuard"
import Observable from "@/Observable"
import { ProtonComponent } from "@/Proton/ProtonComponent"
import { ProtonRef } from "@/Proton/ProtonRef"
import { ChildrenType } from "@/jsx/ProtonJSX"
import { isIterable, isJSX, isRecord } from "@/utils/testers"
import WebNodeBinding from "@/utils/WebNodeBinding"

import { NAMESPACE_MATH, NAMESPACE_SVG } from "./consts"
import { iterableOf, onDemandRef, truthyNonNull } from "./helpers"

import Inflator from "../Inflator"
import Null from "@/Null"


type WebInflateResult<T> =
  T extends Node ? T :
  T extends JSX.Element ? Element :
  T extends Observable<unknown> ? Text :
  T extends (undefined | null) ? T :
  T extends Primitive ? Text :
  T extends any[] ? DocumentFragment :
  Node


interface WebInflatorFlags {
  skipAsync: boolean
  disableJSXCache: boolean
}

class WebInflator extends Inflator {
  private static jsxCache = new WeakMap<object, Node>

  flags: WebInflatorFlags = {
    skipAsync: false,
    disableJSXCache: false,
  }
  /**
   * Custom JSX attributes.
   * Adds or Overrides JSX attribute to provide new behavior.
   * These attributes are virtual and won't be presented in the element.
   * */
  jsxAttributes: CustomAttributesMap = new Map<string, JSXAttributeSetup<any>>()

  protected clone() {
    const clone = new WebInflator
    clone.flags = { ...this.flags }
    clone.jsxAttributes = new Map(this.jsxAttributes)
    return clone
  }

  public inflate<T>(subject: T): WebInflateResult<T> {
    if (subject instanceof Node) return subject as never
    if (isJSX(subject)) return this.inflateJSXDeeply(subject) as never

    return super.inflate(subject) as never
  }
  protected inflatePrimitive(primitive: unknown): Text {
    return document.createTextNode(primitive as string)
  }

  protected inflateFragment() {
    return new Group
  }

  public inflateJSX(jsx: JSX.Element): Node {
    // Alternatives checks.
    switch (typeof jsx.type) {
      case "string": return this.inflateIntrinsic(jsx.type, jsx.props)
      case "function": return this.inflateComponent(jsx.type, jsx.props)
      case "symbol": return this.inflateFragment()
      default: break
    }

    throw new TypeError("Unsupported type of `jsx`", { cause: { jsx } })
  }

  protected inflateObservable<T>(observable: Observable<T> & Partial<AccessorGet<T>>) {
    const value = observable.get?.()

    switch (typeof value) {
      case "object": {
        if (value instanceof Node) return value

        if (isIterable(value)) return this.inflateIterable(observable as never)
        if (isJSX(value)) return this.inflateObservableJSX(observable as never)

        throw new TypeError("Can't choose right way to inflate observable of this type: " + value)
      }
      default:
        return this.inflateObservableText(observable)
    }
  }

  protected inflateObservableText<T>(observable: Observable<T> & Partial<AccessorGet<T>>) {
    const value = observable.get?.()
    const textNode = document.createTextNode(value as string)

    observable.subscribe(value => textNode.nodeValue = (observable.get?.() ?? value) as string)

    return textNode
  }

  protected inflateObservableJSX<T extends JSX.Element>(observable: Observable<T> & Partial<AccessorGet<T>>) {
    const placeholder = onDemandRef(() => new Comment("ObservableJSX/" + observable.constructor.name))

    const value = observable.get!()
    let element = this.inflateJSXDeeply(value) as Partial<ChildNode>

    observable.subscribe?.(value => {
      const next = this.inflate(value) ?? placeholder.current

      element.replaceWith?.(next)
      element = next
    })
    return element
  }

  protected inflateIterable<T, P extends ParentNode = InsertionGroup>(iterable: (IteratorObject<T> & Partial<Observable<IteratorObject<T>>>), parent: P = new InsertionGroup as never): P {
    const replace = (otherIterable: IteratorObject<T> & Partial<Observable<IteratorObject<T>>>) => {
      parent.replaceChildren(...this.__inflateIterable__(otherIterable)) // Previous nodes will be lost at this point.
    }

    replace(iterableOf(iterable))
    iterable.subscribe?.(replace)

    return parent
  }
  protected inflateAsyncIterable<T>(asyncIterable: AsyncIteratorObject<T>): unknown {
    throw new TypeError("Async Iterator is not supported", { cause: { asyncIterable } })
  }

  private inflateJSXDeeply(jsx: JSX.Element): Element | DocumentFragment | Node {
    let inflated

    if (this.flags.disableJSXCache) {
      inflated = this.inflateJSX(jsx)
    } else {
      const inflatedCached = WebInflator.jsxCache.get(jsx)
      if (inflatedCached != null) return inflatedCached

      inflated = this.inflateJSX(jsx)
      WebInflator.jsxCache.set(jsx, inflated)
    }
    // Inflation of Component children is handled by the component itself.
    if (typeof jsx.type === "function") return inflated

    this.inflateJSXChildren(jsx, inflated)

    return inflated
  }

  private inflateJSXChildren(jsx: JSX.Element, parent: Node): void {
    // @ts-expect-error 123
    const actualParent = parent.nodeType === Node.COMMENT_NODE ? parent.inflated : parent

    try {
      switch (jsx.childrenType ?? ChildrenType.None) {
        case ChildrenType.None:
          return
        case ChildrenType.Primitive:
        case ChildrenType.ObservableText:
          WebInflator.subscribeProperty("textContent", jsx.props?.children, actualParent)
          return
        case ChildrenType.ArrayStatic:
          this.inflateIterable(jsx.props!.children, actualParent)
          return
        case ChildrenType.ArrayReactive:
        case ChildrenType.ObservableIterable:
          this.inflateIterable(jsx.props!.children, actualParent)
          return
        case ChildrenType.VNode:
          actualParent.appendChild(this.inflate(jsx.props!.children))
          return
      }
    } catch (error) {
      console.trace(error, "inflateJSXChildren")
      throw error
    }
  }

  private inflateElement(type: string, options?: { namespace?: string, is?: string }) {
    if (options?.namespace != null) return document.createElementNS(options.namespace, type, options)

    if (NAMESPACE_SVG.has(type)) return document.createElementNS("http://www.w3.org/2000/svg", type, options)
    if (NAMESPACE_MATH.has(type)) return document.createElementNS("http://www.w3.org/1998/Math/MathML", type, options)

    return document.createElement(type, options)
  }

  /**
   * Creates element and binds properties.
   */
  public inflateIntrinsic(type: string, props?: Record<string, any>): Element | Comment {
    const inflated = this.inflateElement(type, props?.ns)
    if (props == null) return inflated

    const overridden = this.bindCustomProperties(props, inflated)

    const cls = props.className ?? props.class
    if (cls != null && typeof cls !== "object") {
      const str = String(cls)
      if (inflated instanceof SVGElement) {
        inflated.setAttribute("class", str)
      } else {
        inflated.className = str
      }
      overridden.add("className").add("class")
    }

    this.bindProperties(props, inflated, overridden)

    if (props.ref != null) ProtonRef.resolve(props.ref, inflated)

    let mountGuard: MountGuard
    let immediate = false

    for (const key in props) {
      if (key === "class" || key === "className") continue

      const value = props[key]

      if (MountGuard.is(value) === false) continue
      if (MountGuard.truthy(value)) immediate = true

      mountGuard ??= new MountGuard(inflated)
      mountGuard.for(value)
    }

    if (props.mounted != null) {
      props.mounted.valid ??= truthyNonNull

      if (MountGuard.is(props.mounted)) {
        if (MountGuard.truthy(props.mounted)) immediate = true

        mountGuard ??= new MountGuard(inflated)
        mountGuard.for(props.mounted)
      }
    }


    if (immediate) {
      // @ts-expect-error 123
      mountGuard!.placeholder.current.inflated = inflated
      return mountGuard!.placeholder.current
    }

    return inflated
  }

  static final = new FinalizationRegistry<Disposal>(disposal => {
    disposal.controller.current.abort()
  })

  private components: ProtonComponent[] = []

  public inflateComponent(factory: Function, props?: any) {
    if (this.flags.skipAsync) {
      if (factory instanceof AsyncFunction.constructor) return null
      if (factory instanceof AsyncGeneratorFunction.constructor) return null
    }
    // If arrow function, simplify inflation.
    if (factory.prototype == null && factory instanceof AsyncFunction.constructor === false) {
      return this.inflate(factory(props))
    }

    const component = new ProtonComponent(this, this.component)
    const componentGroup = new InsertionGroup

    this.components.push(component)

    WebInflator.final.register(componentGroup, component.disposal)


    try {
      component.view.initWith(factory.call(component, props))
    } catch (thrown) {
      component.tree.caught(thrown)
      console.error(thrown)
      return componentGroup
    }


    const currentView = component.inflator.inflate(component.view.current) as ChildNode | null
    replace(currentView)

    function replace(view: unknown | null) {
      if (view == null) componentGroup.replaceChildren()
      if (view instanceof Node) componentGroup.replaceChildren(view)
    }


    let lastAnimationFrame = -1
    component.view.subscribe(view => {
      view = component.inflator.inflate(view)

      if (component.view.default == null && component.view.current == null) {
        // Skip scheduling if it's the first view to avoid unnecessary layout-paint.
        replace(view)
        return
      }

      cancelAnimationFrame(lastAnimationFrame)
      lastAnimationFrame = requestAnimationFrame(() => replace(view))
    })

    return componentGroup
  }

  protected bindStyle(style: unknown, element: ElementCSSInlineStyle) {
    if (isRecord(style)) {
      for (const property in style) {
        if (property.startsWith("--")) {
          WebInflator.subscribe(style[property], value => element.style.setProperty(property, value as string))
          continue
        }

        WebInflator.subscribeProperty(property, style[property], element.style)
      }

      return
    }

    WebInflator.subscribe(style, value => element.style.cssText = value as string)
  }

  protected bindEventListeners(listeners: unknown, element: Element) {
    for (const [event, handler] of WebInflator.iterateEventBindings(listeners)) {
      if (DELEGATED_EVENTS.has(event)) {
        let ev = (element as any).$EV
        if (ev == null) {
          ev = {}
          ;(element as any).$EV = ev
        }
        let handlers = ev[event]
        if (handlers == null) {
          handlers = []
          ev[event] = handlers
        }
        handlers.push(handler)
      } else {
        element.addEventListener(event, handler)
      }
    }
  }

  private static *iterateEventBindings(source: unknown): Iterable<[string, EventListenerOrEventListenerObject]> {
    if (source == null) return

    if (Array.isArray(source)) {
      for (const entry of source) {
        yield* WebInflator.iterateEventBindings(entry)
      }
      return
    }

    if (isRecord(source) === false) return

    for (const key in source) {
      yield* WebInflator.iterateEventBindingValue(key, (source as Record<string, unknown>)[key])
    }
  }

  private static *iterateEventBindingValue(event: string, value: unknown): Iterable<[string, EventListenerOrEventListenerObject]> {
    if (value == null) return

    if (Array.isArray(value)) {
      for (const entry of value) {
        yield* WebInflator.iterateEventBindingValue(event, entry)
      }
      return
    }

    if (WebInflator.isEventListener(value)) {
      yield [event, value]
    }
  }

  private static isEventListener(value: unknown): value is EventListenerOrEventListenerObject {
    if (typeof value === "function") return true

    if (value instanceof Object && "handleEvent" in value && typeof (value as EventListenerObject).handleEvent === "function") {
      return true
    }

    return false
  }

  protected bindProperties(props: object, inflated: Element, overridden: Set<string>) {
    try {
      let value

      for (const key in props) {
        value = props[key as never]

        if (key === "children") continue
        if (overridden.has(key)) continue

        if (inflated instanceof SVGElement || key.includes("-")) {
          WebInflator.subscribeAttribute(inflated, key, value)
        } else {
          WebInflator.subscribeProperty(key, value, inflated)
        }
      }

    } catch (error) {
      console.error("Element props binding failed -> ", error)
    }
  }

  /** @returns property names that were overridden. */
  protected bindCustomProperties(props: any, element: Element): Set<string> {
    const overrides = new Set<string>()

    if (isRecord(props.on) || Array.isArray(props.on)) {
      this.bindEventListeners(props.on, element)
      overrides.add("on")
    }

    if (element instanceof HTMLElement && "style" in props) {
      this.bindStyle(props.style, element)
      overrides.add("style")
    }

    if ("aria" in props) {
      for (const key in props.aria) {
        WebInflator.subscribeProperty(key, props.aria[key], element)
      }
      overrides.add("aria")
    }

    if (element instanceof HTMLInputElement) {
      // Ensures correct type beforehand.
      WebInflator.subscribeProperty("type", props.type, element)

      WebNodeBinding.dualSignalBind(element, "valueAsDate", props.valueAsDate, "input")
      WebNodeBinding.dualSignalBind(element, "valueAsNumber", props.valueAsNumber, "input")

      overrides.add("type").add("valueAsDate").add("valueAsNumber")
    }
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      WebNodeBinding.dualSignalBind(element, "value", props.value, "input")
      overrides.add("value")
    }
    if (element instanceof HTMLSelectElement) {
      WebNodeBinding.dualSignalBind(element, "value", props.value, "change")
      overrides.add("value")
    }


    if (this.jsxAttributes.size > 0) {
      function bind(key: string, value: unknown) {
        WebInflator.subscribeProperty(key, value, element)
        overrides.add(key)
      }

      for (const [key, attributeSetup] of this.jsxAttributes) {
        if (key in props === false) continue

        attributeSetup({ props, key, value: props[key], bind })
        overrides.add(key)
      }
    }

    return overrides
  }

  /**
   * Binds a property.
   */
  static subscribeProperty(key: keyof never, source: unknown, target: unknown): void {
    WebInflator.subscribe(source, value => (target as any)[key] = value)
  }

  /**
   * Binds an attribute.
   */
  static subscribeAttribute(target: Element, key: string, value: unknown): void {
    WebInflator.subscribe(value, value => {
      if (value != null) {
        target.setAttribute(key, value as string)
      } else {
        target.removeAttribute(key)
      }
    })
  }

  /** @internal */
  protected static subscribe(source: unknown, targetBindCallback: (value: unknown) => void): void {
    if (source == null) return
    return void State.subscribeImmediate(source, targetBindCallback)
  }

  private __inflateIterable__(iterable: Iterable<unknown> & { length?: number }) {
    if (iterable.length === 0) return Null.ARRAY

    const result = new Array

    for (const next of iterable) {
      if (next == null) continue

      const c = this.inflate(next)
      if (c.nodeType === Node.DOCUMENT_FRAGMENT_NODE && c.childNodes.length === 0) {
        continue
      }

      result.push(c)
    }

    return result
  }
}

const DELEGATED_EVENTS = new Set([
  "click", "dblclick", "keydown", "keyup", "keypress",
  "mousedown", "mousemove", "mouseup",
  "focusin", "focusout",
  "touchstart", "touchend", "touchmove",
])

function handleDelegatedEvent(nativeEvent: Event) {
  let target = nativeEvent.target as Node | null
  while (target) {
    const ev = (target as any).$EV
    const handlers = ev?.[nativeEvent.type]
    if (handlers) {
      for (const handler of handlers) {
        handler(nativeEvent)
      }
    }
    if (nativeEvent.cancelBubble) break
    target = target.parentElement
  }
}

if (!("$EV" in Node.prototype)) {
  ;(Node.prototype as any).$EV = undefined
}

for (const event of DELEGATED_EVENTS) {
  document.addEventListener(event, handleDelegatedEvent)
}

export default WebInflator
