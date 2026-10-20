import { State } from "@denshya/reactive"
import { Group } from "node-group"

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
import { ListArchetypes, ListInflation, ListReconciler, ListRecord } from "@/Reconciler/ListReconciler"
import { noteNestedLiveList, subscriptions } from "@/Subscriptions"
import { Primitive } from "@/type-helpers"
import { isIterable, isJSX, isRecord } from "@/utils/testers"
import WebNodeBinding from "@/utils/WebNodeBinding"

import { NAMESPACE_MATH, NAMESPACE_SVG } from "./consts"
import { iterableOf, onDemandRef, truthyNonNull } from "./helpers"

import Inflator from "../Inflator"


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

class WebInflator extends Inflator implements ListInflation {
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

  protected clone(): WebInflator {
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

  protected inflateFragment(): Group {
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

  protected inflateObservable<T>(observable: Observable<T> & Partial<AccessorGet<T>>): Node | Text {
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

  protected inflateObservableText<T>(observable: Observable<T> & Partial<AccessorGet<T>>): Text {
    const value = observable.get?.()
    const textNode = document.createTextNode(value as string)

    WebInflator.subscribe(observable, function (value) { this.nodeValue = (observable.get?.() ?? value) as string }, textNode, "nodeValue")

    return textNode
  }

  protected inflateObservableJSX<T extends JSX.Element>(observable: Observable<T> & Partial<AccessorGet<T>>): Comment {
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
    const reconciler = new ListReconciler(parent, this)
    const update = (source: IteratorObject<T>) => reconciler.reconcile(toItems(source))

    update(iterableOf(iterable))
    if (iterable.subscribe != null) {
      // A live inner list can grow bound nodes at runtime — the outer record's
      // bound set would go stale, so it falls back to the subtree release walk.
      noteNestedLiveList()
      iterable.subscribe(update)
    }

    return parent
  }

  private inflatePositionedIterable<T>(
    iterable: IteratorObject<T> & Partial<Observable<IteratorObject<T>>>,
    parent: ParentNode,
  ): void {
    const reconciler = new ListReconciler(parent, this, { placeholder: true })
    const update = (source: IteratorObject<T>) => reconciler.reconcile(toItems(source))

    update(iterableOf(iterable))
    if (iterable.subscribe != null) {
      // A live inner list can grow bound nodes at runtime — the outer record's
      // bound set would go stale, so it falls back to the subtree release walk.
      noteNestedLiveList()
      iterable.subscribe(update)
    }
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

    const bound = this.bindIntrinsicProps(type, props, inflated, isSVG)

    if (bound.immediate) {
      bound.mountGuard!.placeholder.current.inflated = inflated
      return bound.mountGuard!.placeholder.current
    }

    return inflated
  }

  /** Binds every prop of an intrinsic element — shared by inflation and whole-node rebinding. */
  private bindIntrinsicProps(type: string, props: Record<string, any>, inflated: Element, isSVG: boolean): { immediate: boolean, mountGuard?: MountGuard } {
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

    return { immediate, mountGuard }
  }

  protected bindClassName(cls: unknown, node: Element, isSVG: boolean): void {
    if (typeof cls !== "object") {
      if (isSVG) node.setAttribute("class", String(cls))
      else node.className = String(cls)
    } else if (isSVG) {
      WebInflator.subscribeAttribute(node, "class", cls)
    } else {
      WebInflator.subscribeProperty("className", cls, node)
    }
  }

  protected bindStyle(style: unknown, element: CSSStyleDeclaration): void {
    if (isRecord(style)) {
      for (const property in style) {
        if (property.startsWith("--")) {
          WebInflator.subscribe(style[property], function (value) { this.setProperty(property, value as string) }, element, "style:" + property)
          continue
        }
        WebInflator.subscribeProperty(property, style[property], element)
      }
      return
    }
    WebInflator.subscribe(style, function (value) { this.cssText = value as string }, element, "style")
  }

  protected bindNodeAria(aria: Record<string, unknown>, node: Element): void {
    for (const key in aria) {
      WebInflator.subscribeProperty(key, aria[key], node)
    }
  }

  protected bindFormControls(type: string, props: Record<string, any> | null | undefined, node: Element): void {
    const track = (key: string) => (subscription: { unsubscribe(): void }) => WebInflator.trackSubscription(node, "bind:" + key, subscription)

    if (type === "input") {
      if (props?.type != null) WebInflator.subscribeProperty("type", props.type, node)
      if (props?.valueAsDate != null) WebNodeBinding.dualSignalBind(node, "valueAsDate", props.valueAsDate, "input", track("valueAsDate"))
      if (props?.valueAsNumber != null) WebNodeBinding.dualSignalBind(node, "valueAsNumber", props.valueAsNumber, "input", track("valueAsNumber"))
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "input", track("value"))
    } else if (type === "textarea") {
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "input", track("value"))
    } else if (type === "select") {
      if (props?.value != null) WebNodeBinding.dualSignalBind(node, "value", props.value, "change", track("value"))
    }
  }

  private readonly bindContext = { props: {}, key: "", value: null as unknown, bind: (() => { }) as any }
  protected bindCustomAttributes(props: Record<string, any>, node: Element): void {
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

  static final: FinalizationRegistry<Disposal> = new FinalizationRegistry<Disposal>(disposal => {
    disposal.controller.current.abort()
  })

  private components: ProtonComponent[] = []

  public inflateComponent(factory: Function, props?: any): Node | InsertionGroup | null {
    if (this.flags.skipAsync) {
      if (factory instanceof AsyncFunction.constructor) return null
      if (factory instanceof AsyncGeneratorFunction.constructor) return null
    }
    // If arrow function, simplify inflation.
    if (factory.prototype == null && factory instanceof AsyncFunction.constructor === false) {
      return this.inflate(factory(props))
    }

    const mounted = props?.mounted

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

  protected bindEventListeners(listeners: unknown, element: Element): void {
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
        WebInflator.trackSubscription(element, "on:" + event, { unsubscribe: () => element.removeEventListener(event, handler) })
      }
    })
  }

  /** Removes every event handler bound from `listeners` on `element` — delegated and native. */
  static unbindEventListeners(listeners: unknown, element: Element): void {
    WebInflator.forEachEventBinding(listeners, event => {
      const ev = (element as any).$EV
      if (ev?.[event] != null) {
        ev[event].length = 0
        delete ev[event]
      }
      WebInflator.unbind(element, "on:" + event)
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

  private static trackSubscription(target: object, key: PropertyKey, sub: { unsubscribe(): void }) {
    subscriptions.track(target, key, sub)
  }

  /** Releases every subscription bound to `key` on `target` — the next bind of that key starts clean. */
  static unbind(target: object, key: PropertyKey): void {
    subscriptions.release(target, key)
  }

  /** Releases every subscription bound to `target` and forgets it. Call when the node leaves the document for good. */
  static dispose(target: object): void {
    subscriptions.dispose(target)
  }

  /**
   * Binds a property. With `replace`, an existing binding under the same key is released in one step — the patch-path rebind.
   */
  static subscribeProperty(key: keyof never, source: unknown, target: unknown, replace = false): void {
    WebInflator.subscribe(source, function (value) { (this as any)[key] = value }, target, key, replace)
  }

  /**
   * Binds an attribute. With `replace`, an existing binding under the same key is released in one step — the patch-path rebind.
   */
  static subscribeAttribute(target: Element, key: string, value: unknown, replace = false): void {
    WebInflator.subscribe(value, function (value) {
      if (value != null) {
        this.setAttribute(key, value as string)
      } else {
        this.removeAttribute(key)
      }
    }, target, key, replace)
  }

  /** @internal */
  protected static subscribe<S>(source: unknown, targetBindCallback: (this: S, value: unknown) => void, thisArg?: S, key?: PropertyKey, replace = false): { unsubscribe(): void } | void {
    if (source == null) return
    if (typeof source !== "object" && typeof source !== "function") {
      targetBindCallback.call(thisArg, source)
      return
    }
    const unsub = State.subscribeImmediate(source, thisArg != null ? targetBindCallback.bind(thisArg) : targetBindCallback)
    if (unsub != null && thisArg != null && key != null) {
      if (replace) subscriptions.replace(thisArg, key, unsub)
      else WebInflator.trackSubscription(thisArg, key, unsub)
    }
    return unsub
  }

  // ---- List reconciliation (implements `ListInflation` for `ListReconciler`) ----

  /** @internal */
  public inflateListItem(item: unknown, archetypes: ListArchetypes): { node: Node, descriptor: unknown } | null {
    // Arrow components are evaluated here, once — their result is what gets inflated and patched.
    const descriptor = unwrapArrowComponents(item)
    const signature = signatureOfDescriptor(descriptor)

    // Same-shape items after the first: clone the inert archetype snapshot and
    // rebind the differences — no element creation, no static-prop walks.
    if (signature != null) {
      const archetype = archetypes.get(signature)
      if (archetype != null) {
        const clone = archetype.node.cloneNode(true)
        if (this.patchNestedNode(clone, archetype.descriptor, descriptor)) {
          return { node: clone, descriptor }
        }
      }
    }

    const node = this.inflateUncached(descriptor)
    if (node == null) return null

    // The archetype is an inert detached snapshot of the first item of its shape:
    // cloned for structure, never bound, never displayed.
    if (signature != null && archetypes.has(signature) === false) {
      archetypes.set(signature, { descriptor, node: node.cloneNode(true) })
    }

    return { node, descriptor }
  }

  /** @internal */
  public patchListItem(record: ListRecord, item: unknown): boolean {
    const node = record.node
    if (node == null) return false

    const old = record.descriptor
    const descriptor = unwrapArrowComponents(item)

    if (this.patchNestedNode(node, old, descriptor)) {
      record.descriptor = descriptor
      return true
    }
    return false
  }

  /** Inflates with the JSX cache disabled — list items must never share cached nodes across positions. */
  private inflateUncached(item: unknown): Node | null {
    const cacheWasDisabled = this.flags.disableJSXCache
    this.flags.disableJSXCache = true
    try {
      return this.inflate(item) as Node | null
    } finally {
      this.flags.disableJSXCache = cacheWasDisabled
    }
  }

  /**
   * Patches `node` — rendered from `oldItem` — in place against an already
   * unwrapped `newDescriptor`. Returns false when the position must be rebuilt.
   */
  private patchNestedNode(node: Node, oldItem: unknown, newDescriptor: unknown): boolean {
    if (oldItem === newDescriptor) return true
    if (newDescriptor == null || oldItem == null) return false

    if (isJSX(newDescriptor)) {
      if (typeof newDescriptor.type !== "string") return false

      if (isJSX(oldItem)) {
        // Known old intrinsic — patch only the same tag, otherwise rebuild the node.
        if (typeof (oldItem as JSX.Element).type !== "string" || (oldItem as JSX.Element).type !== newDescriptor.type) return false
        return this.patchIntrinsic(node as Element, oldItem as JSX.Element, newDescriptor)
      }
      // The previous descriptor is unknown (was a component) — rebind the whole node
      // when its tag matches, otherwise rebuild.
      if (node instanceof Element) return this.rebindIntrinsic(node, newDescriptor)
      return false
    }

    if (node instanceof Text === false || isJSX(oldItem)) return false
    return this.patchTextNode(node, oldItem, newDescriptor)
  }

  /** Patches a text node from a primitive or observable source. */
  private patchTextNode(node: Text, oldItem: unknown, newItem: unknown): boolean {
    if (typeof newItem !== "object" && typeof newItem !== "function") {
      if (typeof oldItem === "object" || typeof oldItem === "function") WebInflator.unbind(node, "nodeValue")
      node.nodeValue = newItem as string
      return true
    }

    if (newItem !== oldItem) {
      WebInflator.subscribe(newItem, function (value) { this.nodeValue = String(value ?? "") }, node, "nodeValue", true)
    }
    return true
  }

  /**
   * Patches an existing element against a same-type intrinsic descriptor:
   * only changed props are rebound, children are reconciled recursively.
   */
  private patchIntrinsic(element: Element, oldJsx: JSX.Element, newJsx: JSX.Element): boolean {
    const type = newJsx.type as string
    const oldProps = (oldJsx.props ?? {}) as Record<string, any>
    const newProps = (newJsx.props ?? {}) as Record<string, any>

    // Mount guards and form controls carry state that cannot be patched in place.
    if ("mounted" in newProps || "mounted" in oldProps) return false
    if (type === "input" || type === "textarea" || type === "select") {
      if (oldProps.value !== newProps.value || oldProps.type !== newProps.type
        || oldProps.valueAsDate !== newProps.valueAsDate || oldProps.valueAsNumber !== newProps.valueAsNumber) return false
    }

    const isSVG = NAMESPACE_SVG.has(type)

    for (const key in newProps) {
      if (key === "children" || key === "ns") continue
      const value = newProps[key]
      const oldValue = oldProps[key]

      if (MountGuard.is(value) || MountGuard.is(oldValue)) return false

      if (key === "ref") {
        if (value != null && value !== oldValue) ProtonRef.resolve(value, element)
        continue
      }
      if (key === "className" || key === "class") {
        if (value !== oldValue) {
          WebInflator.unbind(element, isSVG ? "class" : "className")
          if (value != null) this.bindClassName(value, element, isSVG)
        }
        continue
      }
      if (key === "style") {
        if (value !== oldValue) {
          this.unbindStyle(element, oldValue)
          if (value != null) this.bindStyle(value, element.style)
        }
        continue
      }
      if (key === "on") {
        if (value !== oldValue) {
          WebInflator.unbindEventListeners(oldValue, element)
          this.bindEventListeners(value, element)
        }
        continue
      }
      if (key === "aria") {
        if (value !== oldValue) {
          if (isRecord(oldValue)) for (const ariaKey in oldValue) WebInflator.unbind(element, ariaKey)
          if (isRecord(value)) this.bindNodeAria(value, element)
        }
        continue
      }

      if (value === oldValue) continue

      // Unknown props — bind as attribute or property, mirroring `bindIntrinsicProps`.
      // Observable binds replace the prior entry under the same key in one step.
      if (typeof value !== "object" && typeof value !== "function" && value != null) {
        WebInflator.unbind(element, key)
        if (isSVG || key.includes("-")) element.setAttribute(key, value as string)
        else (element as any)[key] = value
      } else if (value != null) {
        if (isSVG || key.includes("-")) WebInflator.subscribeAttribute(element, key, value, true)
        else WebInflator.subscribeProperty(key, value, element, true)
      } else {
        WebInflator.unbind(element, key)
      }
    }

    // Props that were present before but are gone now — release their bindings.
    for (const key in oldProps) {
      if (key in newProps || key === "children" || key === "ns") continue
      const oldValue = oldProps[key]

      if (key === "ref") continue
      if (key === "className" || key === "class") {
        WebInflator.unbind(element, isSVG ? "class" : "className")
        element.removeAttribute("class")
        continue
      }
      if (key === "style") {
        this.unbindStyle(element, oldValue)
        element.removeAttribute("style")
        continue
      }
      if (key === "on") {
        WebInflator.unbindEventListeners(oldValue, element)
        continue
      }
      if (key === "aria") {
        if (isRecord(oldValue)) for (const ariaKey in oldValue) WebInflator.unbind(element, ariaKey)
        continue
      }

      WebInflator.unbind(element, key)
      if (isSVG || key.includes("-")) {
        element.removeAttribute(key)
      } else {
        // A property bind reflects back into an attribute (`disabled`, `checked`, …), and
        // a cloned archetype node is snapshotted with the first item's attributes. Dropping
        // the binding alone leaves both behind, so a sibling that never declared the prop —
        // patched onto the same clone — would keep the archetype's stale value.
        try {
          element.removeAttribute(key)
          delete (element as any)[key]
        } catch { /* ignore invalid or non-configurable keys */ }
      }
    }

    return this.patchChildren(element, oldJsx, newJsx)
  }

  /** Releases the style bindings a previous `style` prop value created. */
  private unbindStyle(element: Element, oldValue: unknown): void {
    if (isRecord(oldValue)) {
      for (const property in oldValue) {
        WebInflator.unbind(element, property.startsWith("--") ? "style:" + property : property)
      }
      return
    }
    WebInflator.unbind(element, "style")
  }

  /** Reconciles the children of an element being patched in place. */
  private patchChildren(element: Element, oldJsx: JSX.Element, newJsx: JSX.Element): boolean {
    const oldType = oldJsx.childrenType ?? ChildrenType.None
    const newType = newJsx.childrenType ?? ChildrenType.None

    if (oldType !== newType) {
      const bothText = (oldType === ChildrenType.Primitive || oldType === ChildrenType.ObservableText)
        && (newType === ChildrenType.Primitive || newType === ChildrenType.ObservableText)
      if (bothText === false) return false
    }

    switch (newType) {
      case ChildrenType.None:
        return oldType === ChildrenType.None

      case ChildrenType.Primitive:
      case ChildrenType.ObservableText: {
        const text = newJsx.props?.children
        if (text === oldJsx.props?.children) return true

        if (typeof text !== "object" && typeof text !== "function") {
          WebInflator.unbind(element, "textContent")
          element.textContent = text as string
        } else {
          WebInflator.subscribeProperty("textContent", text, element, true)
        }
        return true
      }

      case ChildrenType.ArrayStatic:
      case ChildrenType.ArrayReactive:
        return this.patchChildrenArray(element, oldJsx, newJsx)

      case ChildrenType.ObservableIterable:
        // An inner subscribable list keeps its own reconciler; only a changed source needs a rebuild.
        return newJsx.props!.children === oldJsx.props!.children

      case ChildrenType.VNode: {
        const newChild = newJsx.props?.children
        const oldChild = oldJsx.props?.children
        if (newChild === oldChild) return true

        const childNode = element.firstChild
        if (childNode == null) return false

        return this.patchNestedNode(childNode, oldChild, unwrapArrowComponents(newChild))
      }
    }
  }

  /** Reconciles array children positionally — the record algorithm, one level down. */
  private patchChildrenArray(element: Element, oldJsx: JSX.Element, newJsx: JSX.Element): boolean {
    const newChildren = newJsx.props!.children as unknown[]
    const oldChildren = oldJsx.props!.children as unknown[]

    if (newChildren === oldChildren) return true

    // Nullish children inflate to nothing, breaking child-node alignment — rebuild instead.
    for (const child of oldChildren) if (child == null) return false
    for (const child of newChildren) if (child == null) return false

    const common = Math.min(oldChildren.length, newChildren.length)

    let child = element.firstChild
    for (let index = 0; index < common; index++) {
      if (child == null) return false

      const next = child.nextSibling
      const descriptor = unwrapArrowComponents(newChildren[index])
      if (this.patchNestedNode(child, oldChildren[index], descriptor) === false) return false
      child = next
    }

    // Shed the extra old children.
    for (let index = common; index < oldChildren.length && child != null; index++) {
      const next = child.nextSibling
      ListReconciler.destroyNode(child)
      child = next
    }

    // Append the extra new children.
    if (newChildren.length > common) {
      for (let index = common; index < newChildren.length; index++) {
        const node = this.inflateUncached(unwrapArrowComponents(newChildren[index]))
        if (node != null) element.appendChild(node)
      }
    }

    return true
  }

  /** Rebinds a whole existing element to `newJsx` when the previous descriptor is unknown. */
  private rebindIntrinsic(element: Element, newJsx: JSX.Element): boolean {
    const props = (newJsx.props ?? {}) as Record<string, any>
    if ("mounted" in props) return false

    // The node's tag must match the descriptor — a mismatch needs a fresh element.
    if (element.tagName.toLowerCase() !== String(newJsx.type).toLowerCase()) return false

    const ev = (element as any).$EV
    if (ev != null) {
      for (const event in ev) {
        ev[event].length = 0
        delete ev[event]
      }
    }
    WebInflator.dispose(element)

    this.bindIntrinsicProps(newJsx.type as string, props, element, NAMESPACE_SVG.has(newJsx.type as string))

    element.replaceChildren()
    this.inflateJSXChildren(newJsx, element)
    return true
  }
}

/**
 * Structural signature of a list-item descriptor — the tag, children shape and
 * child signatures, ignoring prop values. Two descriptors with the same signature
 * are clone-compatible: an archetype of one can be cloned and rebound for the
 * other. Non-intrinsic roots, fragments, and live inner lists (subscribable
 * children sources) have no signature — they are never cloned.
 */
function signatureOfDescriptor(descriptor: unknown): string | null {
  if (isJSX(descriptor) === false) return typeof descriptor === "object" || typeof descriptor === "function" ? null : "text"
  const jsx = descriptor as JSX.Element

  if (typeof jsx.type !== "string") return null

  switch (jsx.childrenType ?? ChildrenType.None) {
    case ChildrenType.None:
    case ChildrenType.Primitive:
    case ChildrenType.ObservableText:
      return `${jsx.type}|${jsx.childrenType}`
    case ChildrenType.VNode: {
      const child = signatureOfDescriptor(jsx.props?.children)
      return child == null ? null : `${jsx.type}|v>${child}`
    }
    case ChildrenType.ArrayStatic:
    case ChildrenType.ArrayReactive: {
      const children = jsx.props?.children as unknown[]
      if (Array.isArray(children) === false) return null
      let signature = `${jsx.type}|[`
      for (const child of children) {
        const childSignature = signatureOfDescriptor(child)
        if (childSignature == null) return null
        signature += childSignature + ","
      }
      return signature + "]"
    }
    case ChildrenType.ObservableIterable:
      return null
  }
  return null
}

function toItems<T>(source: IteratorObject<T>): readonly unknown[] {
  return Array.isArray(source) ? source : Array.from(source as Iterable<unknown>)
}

/** Evaluates a chain of arrow-function components down to the descriptor they render. */
function unwrapArrowComponents(value: unknown): unknown {
  let descriptor = value
  while (isJSX(descriptor) && typeof descriptor.type === "function" && (descriptor.type as Function).prototype == null) {
    descriptor = (descriptor.type as Function)((descriptor as JSX.Element).props)
  }
  return descriptor
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
