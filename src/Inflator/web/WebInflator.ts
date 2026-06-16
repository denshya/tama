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
      case "string": return this.inflateIntrinsic(jsx)
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
      parent.replaceChildren(...this.__inflateIterable__(otherIterable))
    }

    replace(iterableOf(iterable))
    iterable.subscribe?.(replace)

    return parent
  }

  private inflatePositionedIterable<T>(
    iterable: IteratorObject<T> & Partial<Observable<IteratorObject<T>>>,
    parent: ParentNode,
  ): void {
    let anchor = parent.lastChild
    let currentNodes: Node[] = []

    const replace = (otherIterable: IteratorObject<T>) => {
      for (const node of currentNodes) (node as ChildNode).remove()
      currentNodes.length = 0

      const nodes = this.__inflateIterable__(otherIterable)
      if (nodes.length === 0 && !anchor) {
        anchor = document.createComment("reactive-iterable")
        parent.appendChild(anchor)
        return
      }
      if (nodes.length === 0) return

      currentNodes.push(...nodes)

      if (anchor && anchor.isConnected) {
        anchor.after(...nodes)
      } else {
        parent.prepend(...nodes)
      }

      anchor = nodes[nodes.length - 1]
    }

    replace(iterableOf(iterable))
    iterable.subscribe?.(replace)
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
          {
            const text = jsx.props!.children
            if (typeof text !== "object" && typeof text !== "function") {
              actualParent.textContent = text as string
            } else {
              WebInflator.subscribeProperty("textContent", text, actualParent)
            }
          }
          return
        case ChildrenType.ObservableText:
          WebInflator.subscribeProperty("textContent", jsx.props?.children, actualParent)
          return
        case ChildrenType.ArrayStatic:
          this.inflateIterable(jsx.props!.children, actualParent)
          return
        case ChildrenType.ArrayReactive:
        case ChildrenType.ObservableIterable:
          this.inflatePositionedIterable(jsx.props!.children, actualParent)
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
  public inflateIntrinsic(jsx: JSX.Element): Element | Comment {
    const type = jsx.type as string
    const props = jsx.props as Record<string, any> | null | undefined

    if (props == null) return this.inflateElement(type)

    const isSVG = NAMESPACE_SVG.has(type)
    const inflated = this.inflateElement(type, props.ns != null ? { namespace: props.ns as string } : undefined)

    let mountGuard: MountGuard | undefined
    let immediate = false

    for (const key in props) {
      if (key === "children" || key === "ns") continue
      const value = props[key]

      if (MountGuard.is(value)) {
        mountGuard ??= new MountGuard(inflated)
        if (MountGuard.truthy(value)) immediate = true
        mountGuard.for(value)
        continue
      }

      if (key === "ref") {
        if (value != null) ProtonRef.resolve(value, inflated)
        continue
      }
      if (key === "className" || key === "class") {
        if (value != null) this.bindClassName(value, inflated, isSVG)
        continue
      }
      if (key === "style") {
        if (value != null) this.bindStyle(value, inflated.style)
        continue
      }
      if (key === "on") {
        this.bindEventListeners(value, inflated)
        continue
      }
      if (key === "aria") {
        if (isRecord(value)) this.bindNodeAria(value, inflated)
        continue
      }
      if (key === "mounted") {
        if (value != null) {
          (value as any).valid ??= truthyNonNull
          if (MountGuard.is(value)) {
            if (MountGuard.truthy(value)) immediate = true
            mountGuard ??= new MountGuard(inflated)
            mountGuard.for(value)
          }
        }
        continue
      }

      // Unknown props — bind as attribute or property
      if (typeof value !== "object" && typeof value !== "function" && value != null) {
        if (isSVG || key.includes("-")) inflated.setAttribute(key, value as string)
        else (inflated as any)[key] = value
      } else if (value != null) {
        if (isSVG || key.includes("-")) WebInflator.subscribeAttribute(inflated, key, value)
        else WebInflator.subscribeProperty(key, value, inflated)
      }
    }

    this.bindFormControls(type, props, inflated)
    this.bindCustomAttributes(props, inflated)

    if (immediate) {
      (mountGuard!).placeholder.current.inflated = inflated
      return mountGuard!.placeholder.current
    }

    return inflated
  }

  protected bindClassName(cls: unknown, node: Element, isSVG: boolean) {
    if (typeof cls !== "object") {
      if (isSVG) node.setAttribute("class", String(cls))
      else node.className = String(cls)
    } else if (isSVG) {
      WebInflator.subscribeAttribute(node, "class", cls)
    } else {
      WebInflator.subscribeProperty("className", cls, node)
    }
  }

  protected bindStyle(style: unknown, element: CSSStyleDeclaration) {
    if (isRecord(style)) {
      for (const property in style) {
        if (property.startsWith("--")) {
          WebInflator.subscribe(style[property], function (value) { this.setProperty(property, value as string) }, element)
          continue
        }
        WebInflator.subscribeProperty(property, style[property], element)
      }
      return
    }
    WebInflator.subscribe(style, function (value) { this.cssText = value as string }, element)
  }

  protected bindNodeAria(aria: Record<string, unknown>, node: Element) {
    for (const key in aria) {
      WebInflator.subscribeProperty(key, aria[key], node)
    }
  }

  protected bindFormControls(type: string, props: Record<string, any> | null | undefined, node: Element) {
    if (type === "input") {
      if (props?.type != null) WebInflator.subscribeProperty("type", props.type, node)
      if (props?.valueAsDate != null) WebNodeBinding.dualSignalBind(node, "valueAsDate", props.valueAsDate, "input")
      if (props?.valueAsNumber != null) WebNodeBinding.dualSignalBind(node, "valueAsNumber", props.valueAsNumber, "input")
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "input")
    } else if (type === "textarea") {
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "input")
    } else if (type === "select") {
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "change")
    }
  }

  private readonly bindContext = { props: {}, key: "", value: null as unknown, bind: (() => { }) as any }
  protected bindCustomAttributes(props: Record<string, any>, node: Element) {
    if (this.jsxAttributes.size === 0) return
    const bind = (key: string, value: unknown) => {
      WebInflator.subscribeProperty(key, value, node)
    }

    for (const [key, attributeSetup] of this.jsxAttributes) {
      if (key in props === false) continue

      this.bindContext.bind = bind
      this.bindContext.props = props
      this.bindContext.key = key
      this.bindContext.value = props[key]
      attributeSetup(this.bindContext)
    }
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

    const mounted = props?.mounted
    if (mounted != null) {
      props = { ...props }
      delete props.mounted
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

    let mountState = true
    if (mounted != null && MountGuard.is(mounted)) {
      mountState = MountGuard.truthy(mounted) === false
    }

    const currentView = component.inflator.inflate(component.view.current) as ChildNode | null
    replace(currentView)

    function replace(view: unknown | null) {
      if (!mountState) {
        componentGroup.replaceChildren()
        return
      }
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

    if (mounted != null && MountGuard.is(mounted)) {
      mounted.subscribe(() => {
        const newState = mounted.valid(mounted.get?.() ?? mounted.valueOf())
        if (newState === mountState) return
        mountState = newState
        replace(component.view.current)
      })
    }

    return componentGroup
  }

  protected bindEventListeners(listeners: unknown, element: Element) {
    WebInflator.forEachEventBinding(listeners, (event, handler) => {
      if (DELEGATED_EVENTS.has(event)) {
        let ev = (element as any).$EV
        if (ev == null) {
          ev = {}
            ; (element as any).$EV = ev
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
    })
  }

  private static forEachEventBinding(
    source: unknown,
    callback: (event: string, handler: EventListenerOrEventListenerObject) => void,
  ): void {
    if (source == null) return

    if (Array.isArray(source)) {
      for (const entry of source) {
        WebInflator.forEachEventBinding(entry, callback)
      }
      return
    }

    if (isRecord(source) === false) return

    for (const key in source) {
      WebInflator.forEachEventBindingValue(key, (source as Record<string, unknown>)[key], callback)
    }
  }

  private static forEachEventBindingValue(
    event: string,
    value: unknown,
    callback: (event: string, handler: EventListenerOrEventListenerObject) => void,
  ): void {
    if (value == null) return

    if (Array.isArray(value)) {
      for (const entry of value) {
        WebInflator.forEachEventBindingValue(event, entry, callback)
      }
      return
    }

    if (WebInflator.isEventListener(value)) {
      callback(event, value)
    }
  }

  private static isEventListener(value: unknown): value is EventListenerOrEventListenerObject {
    if (typeof value === "function") return true

    if (value instanceof Object && "handleEvent" in value && typeof (value as EventListenerObject).handleEvent === "function") {
      return true
    }

    return false
  }

  private static subscriptions = new Map<object, { unsubscribe(): void }[]>

  private static trackSubscription(target: object, sub: { unsubscribe(): void }) {
    let subs = WebInflator.subscriptions.get(target)
    if (subs == null) {
      subs = []
      WebInflator.subscriptions.set(target, subs)
    }
    subs.push(sub)
  }

  /**
   * Binds a property.
   */
  static subscribeProperty(key: keyof never, source: unknown, target: unknown): void {
    WebInflator.subscribe(source, function (value) { (this as any)[key] = value }, target)
  }

  /**
   * Binds an attribute.
   */
  static subscribeAttribute(target: Element, key: string, value: unknown): void {
    WebInflator.subscribe(value, function (value) {
      if (value != null) {
        this.setAttribute(key, value as string)
      } else {
        this.removeAttribute(key)
      }
    }, target)
  }

  /** @internal */
  protected static subscribe<S>(source: unknown, targetBindCallback: (this: S, value: unknown) => void, thisArg?: S): { unsubscribe(): void } | void {
    if (source == null) return
    if (typeof source !== "object" && typeof source !== "function") {
      targetBindCallback.call(thisArg, source)
      return
    }
    const unsub = State.subscribeImmediate(source, thisArg != null ? targetBindCallback.bind(thisArg) : targetBindCallback)
    if (unsub != null && thisArg != null) {
      WebInflator.trackSubscription(thisArg, unsub)
    }
    return unsub
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
  ; (Node.prototype as any).$EV = undefined
}

if (!("__tama_delegation" in document)) {
  ; (document as any).__tama_delegation = true
  for (const event of DELEGATED_EVENTS) {
    document.addEventListener(event, handleDelegatedEvent)
  }
}

export default WebInflator
