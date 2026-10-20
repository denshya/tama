import { IsEqual, LiteralUnion } from "@/type-helpers"

import { Accessible, AccessorGet } from "../Accessor"
import Guarded from "../Guarded"
import Observable from "../Observable"
import { htmlAttributeAliases, svgAttributeAliases } from "./attributes"
import { ChildrenType } from "./ProtonJSX"



type BooleanLike = boolean | "true" | "false"


type AriaBooleanKeys =
  | "ariaChecked"
  | "ariaDisabled"
  | "ariaExpanded"
  | "ariaHidden"
  | "ariaInvalid"
  | "ariaPressed"
  | "ariaReadOnly"
  | "ariaRequired"
  | "ariaSelected"

type AriaValue<K extends keyof ARIAMixin> = K extends AriaBooleanKeys ? BooleanLike | ARIAMixin[K] : ARIAMixin[K]

type AugmentedAria<T> = Omit<T, keyof ARIAMixin> & {
  aria?: { [K in keyof ARIAMixin]?: JSX.Attribute<AriaValue<K>> }
}


/** https://github.com/type-challenges/type-challenges/issues/139 */
type GetReadonlyKeys<
  T,
  U extends Readonly<T> = Readonly<T>,
  K extends keyof T = keyof T
> = K extends keyof T ? IsEqual<Pick<T, K>, Pick<U, K>> extends true ? K : never : never;


type AnyFunction = ((...args: any[]) => unknown)


type NonFunctionKeysOnly<K, V, R> = (
  K extends R ? never :
  AnyFunction extends V ? never :
  V extends AnyFunction ? never :
  K
)
interface _AttributesOf<T> {
  ReadonlyKeys: GetReadonlyKeys<T>
  Attributes: {
    [K in (keyof T) as NonFunctionKeysOnly<K, T[K], this["ReadonlyKeys"]>]: JSX.Attribute<T[K]>
  }
}

declare global {
  namespace JSX {
    interface Element {
      type: any
      props?: any
      children?: any
      childrenType?: ChildrenType
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ElementTypeConstructor { }
    interface ElementTypeConstructor {
      (this: never, props: never): unknown
    }
    type ElementType = string | Element | ElementTypeConstructor

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ElementChildrenAttribute { children: {} }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ElementAttributesProperty { props: {} }


    type Attribute<T> =
      | T
      | Partial<Observable<T>>
      | Partial<Accessible<T>>
      | Partial<Guarded<T>>

    type Children<T extends JSX.Element> = T | Iterable<T>

    type HTMLElementEvents = {
      [K in keyof HTMLElementEventMap]?: ((event: HTMLElementEventMap[K]) => void) | readonly ((event: HTMLElementEventMap[K]) => void)[]
    }

    interface IntrinsicAttributes {
      // /**
      //  * You can create `ref` forwards on components.
      //  * Define a `ref` attribute on your component props with `JSX.Ref` and apply it to an element.
      //  *
      //  * @example
      //  * ```tsx
      //  * interface ComponentProps {
      //  *   // ...
      //  *   ref?: JSX.Ref<HTMLElement>
      //  * }
      //  *
      //  * function Component(props: ComponentProps) {
      //  *   return <div ref={props.ref} />
      //  * }
      //  *
      //  * const someRef = new Tama.Ref<HTMLElement>
      //  * <Component ref={someRef} />
      //  * ```
      //  *
      //  * @example
      //  * ```tsx
      //  * function Component(props: ComponentProps) {
      //  *   return <div ref={props.ref} />
      //  * }
      //  *
      //  * const someRef = new Tama.Ref<HTMLElement>
      //  * <Component ref={someRef} />
      //  * ```
      // */
      // ref?: never // Developer-defined
      mounted?: AccessorGet<any> | Observable<any>
    }

    interface CustomAttributes {
      ns?: LiteralUnion<string, "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | "http://www.w3.org/1998/Math/MathML">
      on?: HTMLElementEvents | readonly HTMLElementEvents[]
      style?: Attribute<Record<string, Attribute<string | CSSStyleValue>> | { [K in keyof CSSStyleDeclaration]?: Attribute<CSSStyleDeclaration[K] | CSSStyleValue | null | undefined> } | string>
    }

    type DataAttributes = {
      [K in `data-${string}`]?: Attribute<string | number | boolean | null | undefined>
    }

    type RawAriaAttributes = {
      [K in `aria-${string}`]?: Attribute<string | number | boolean | null | undefined>
    }

    type CommonAttributes = {
      /** @attribute */
      class?: Attribute<string>
      /** @attribute */
      role?: Attribute<string>
    } & DataAttributes & RawAriaAttributes

    type AttributeAliasValue<T, Property> = Property extends keyof T ? Attribute<T[Property]> : never

    type NumericAttributeAlias = "colspan" | "rowspan" | "maxlength" | "minlength" | "tabindex"

    type HTMLAttributeAliasAttributes<T> = {
      [Alias in keyof typeof htmlAttributeAliases as
        typeof htmlAttributeAliases[Alias] extends keyof T ? Alias : never]?:
        Alias extends NumericAttributeAlias
          ? Attribute<number | string>
          : AttributeAliasValue<T, typeof htmlAttributeAliases[Alias]>
    }

    /**
     * Native SVG attribute names, including hyphenated ones.
     * `@attribute` marks a field that binds through `setAttribute` rather than a DOM property.
     */
    interface SVGAttributeProps {
      /** Alias for the `class` attribute. */
      className?: Attribute<string>
      /** @attribute */
      tabindex?: Attribute<number | string>

      /** @attribute */
      fill?: Attribute<string>
      /** @attribute */
      "fill-opacity"?: Attribute<string | number>
      /** @attribute */
      "fill-rule"?: Attribute<LiteralUnion<"nonzero" | "evenodd", string>>
      /** @attribute */
      stroke?: Attribute<string>
      /** @attribute */
      "stroke-width"?: Attribute<string | number>
      /** @attribute */
      "stroke-opacity"?: Attribute<string | number>
      /** @attribute */
      "stroke-linecap"?: Attribute<LiteralUnion<"butt" | "round" | "square", string>>
      /** @attribute */
      "stroke-linejoin"?: Attribute<LiteralUnion<"arcs" | "bevel" | "miter" | "miter-clip" | "round", string>>
      /** @attribute */
      "stroke-dasharray"?: Attribute<string | number>
      /** @attribute */
      "stroke-dashoffset"?: Attribute<string | number>
      /** @attribute */
      "stroke-miterlimit"?: Attribute<string | number>

      /** @attribute */
      opacity?: Attribute<string | number>
      /** @attribute */
      color?: Attribute<string>
      /** @attribute */
      display?: Attribute<string>
      /** @attribute */
      visibility?: Attribute<LiteralUnion<"collapse" | "hidden" | "visible", string>>
      /** @attribute */
      overflow?: Attribute<LiteralUnion<"auto" | "hidden" | "scroll" | "visible", string>>
      /** @attribute */
      cursor?: Attribute<string>

      /** @attribute */
      "clip-path"?: Attribute<string>
      /** @attribute */
      "clip-rule"?: Attribute<LiteralUnion<"evenodd" | "nonzero", string>>
      /** @attribute */
      clip?: Attribute<string>
      /** @attribute */
      mask?: Attribute<string>
      /** @attribute */
      "mask-type"?: Attribute<LiteralUnion<"alpha" | "luminance", string>>
      /** @attribute */
      filter?: Attribute<string>
      /** @attribute */
      "marker-start"?: Attribute<string>
      /** @attribute */
      "marker-mid"?: Attribute<string>
      /** @attribute */
      "marker-end"?: Attribute<string>

      /** @attribute */
      "text-anchor"?: Attribute<LiteralUnion<"end" | "middle" | "start", string>>
      /** @attribute */
      "dominant-baseline"?: Attribute<string>
      /** @attribute */
      "alignment-baseline"?: Attribute<string>
      /** @attribute */
      "baseline-shift"?: Attribute<string | number>

      /** @attribute */
      "font-family"?: Attribute<string>
      /** @attribute */
      "font-size"?: Attribute<string | number>
      /** @attribute */
      "font-style"?: Attribute<string>
      /** @attribute */
      "font-weight"?: Attribute<string | number>
      /** @attribute */
      "font-stretch"?: Attribute<string>
      /** @attribute */
      "font-variant"?: Attribute<string>
      /** @attribute */
      "font-size-adjust"?: Attribute<string | number>
      /** @attribute */
      "letter-spacing"?: Attribute<string | number>
      /** @attribute */
      "word-spacing"?: Attribute<string | number>
      /** @attribute */
      "text-decoration"?: Attribute<string>
      /** @attribute */
      "text-rendering"?: Attribute<LiteralUnion<"auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed", string>>
      /** @attribute */
      "writing-mode"?: Attribute<string>
      /** @attribute */
      "unicode-bidi"?: Attribute<string>
      /** @attribute */
      "glyph-orientation-horizontal"?: Attribute<string>
      /** @attribute */
      "glyph-orientation-vertical"?: Attribute<string>

      /** @attribute */
      "paint-order"?: Attribute<string>
      /** @attribute */
      "vector-effect"?: Attribute<LiteralUnion<"none" | "non-scaling-stroke" | "non-scaling-size" | "non-rotation" | "fixed-position", string>>
      /** @attribute */
      "shape-rendering"?: Attribute<LiteralUnion<"auto" | "crispEdges" | "geometricPrecision" | "optimizeSpeed", string>>
      /** @attribute */
      "image-rendering"?: Attribute<string>
      /** @attribute */
      "color-interpolation"?: Attribute<string>
      /** @attribute */
      "color-interpolation-filters"?: Attribute<string>
      /** @attribute */
      "color-rendering"?: Attribute<string>
      /** @attribute */
      "color-profile"?: Attribute<string>
      /** @attribute */
      "pointer-events"?: Attribute<string>
      /** @attribute */
      "mix-blend-mode"?: Attribute<string>
      /** @attribute */
      isolation?: Attribute<string>

      /** @attribute */
      "stop-color"?: Attribute<string>
      /** @attribute */
      "stop-opacity"?: Attribute<string | number>
      /** @attribute */
      "flood-color"?: Attribute<string>
      /** @attribute */
      "flood-opacity"?: Attribute<string | number>
      /** @attribute */
      "lighting-color"?: Attribute<string>

      /** @attribute */
      transform?: Attribute<string>
      /** @attribute */
      "transform-origin"?: Attribute<string>

      /** @attribute */
      viewBox?: Attribute<string>
      /** @attribute */
      preserveAspectRatio?: Attribute<string>
      /** @attribute */
      points?: Attribute<string>
      /** @attribute */
      d?: Attribute<string>
      /** @attribute */
      pathLength?: Attribute<string | number>
      /** @attribute */
      width?: Attribute<string | number>
      /** @attribute */
      height?: Attribute<string | number>
      /** @attribute */
      x?: Attribute<string | number>
      /** @attribute */
      y?: Attribute<string | number>
      /** @attribute */
      rx?: Attribute<string | number>
      /** @attribute */
      ry?: Attribute<string | number>
      /** @attribute */
      cx?: Attribute<string | number>
      /** @attribute */
      cy?: Attribute<string | number>
      /** @attribute */
      r?: Attribute<string | number>
      /** @attribute */
      x1?: Attribute<string | number>
      /** @attribute */
      y1?: Attribute<string | number>
      /** @attribute */
      x2?: Attribute<string | number>
      /** @attribute */
      y2?: Attribute<string | number>

      /** @attribute */
      gradientUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      gradientTransform?: Attribute<string>
      /** @attribute */
      patternUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      patternContentUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      patternTransform?: Attribute<string>
      /** @attribute */
      clipPathUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      maskUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      maskContentUnits?: Attribute<LiteralUnion<"objectBoundingBox" | "userSpaceOnUse", string>>
      /** @attribute */
      markerUnits?: Attribute<LiteralUnion<"strokeWidth" | "userSpaceOnUse", string>>
      /** @attribute */
      markerWidth?: Attribute<string | number>
      /** @attribute */
      markerHeight?: Attribute<string | number>
      /** @attribute */
      refX?: Attribute<string | number>
      /** @attribute */
      refY?: Attribute<string | number>
      /** @attribute */
      spreadMethod?: Attribute<LiteralUnion<"pad" | "reflect" | "repeat", string>>
      /** @attribute */
      startOffset?: Attribute<string | number>

      /** @attribute */
      xmlns?: Attribute<string>
      /** @attribute */
      "xmlns:xlink"?: Attribute<string>
    }

    type SVGAttributeAliasAttributes = {
      [Property in keyof typeof svgAttributeAliases]?:
        typeof svgAttributeAliases[Property] extends keyof SVGAttributeProps
          ? SVGAttributeProps[typeof svgAttributeAliases[Property]]
          : Attribute<string | number>
    }

    type Ref<T> = { current: T | null | undefined } | ((current: T) => void)
    type AttributesOf<T> = _AttributesOf<T>["Attributes"]

    type ElementAttributes<T> =
      & Partial<AttributesOf<AugmentedAria<T>>>
      & CommonAttributes
      & CustomAttributes
      & IntrinsicAttributes
      & {
        /**
         * Assigns an HTMLElement instance to given `ref`.
         * Accepts either a mutable object with a `current` property or a callback function.
         * Accepts multiple refs as an array.
         * Fires after the element attributes are set, but before it's connected to the DOM.
         *
         * [Documentation](https://tama.denshya.dev/learn/guides/ref)
         *
         * @example
         * ```tsx
         * const elementRef = new Tama.Ref<HTMLElement>(null)
         * <div ref={elementRef} />
         * ```
         *
         * @example
         * ```tsx
         * const myRef: { current: HTMLElement | null } = { current: null }
         * <div ref={myRef} />
         * ```
         *
         * @example
         * ```tsx
         * <div ref={element => {
         *   element.style.backgroundColor = "red"
         * }} />
         * ```
         *
         * @example
         * ```tsx
         * const ref1 = new Tama.Ref<HTMLElement>(null)
         * const ref2 = { current: HTMLElement | null } = { current: null }
         * const moveLeft = (element: HTMLElement) => element.style.transform = "translateX(-100%)"
         *
         * <div ref={[ref1, ref2, moveLeft]} />
         * ```
         */
        ref?: Ref<T> | Ref<T>[]
      }
      & { children?: unknown }
    // & {
    //   /**
    //    * The tag name of a custom element previously defined via `customElements.define()`.
    //    *
    //    * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement#is)
    //    */
    //   is?: string
    // }
    type SVGElementAttributes<T> = ElementAttributes<T> & SVGAttributeProps & SVGAttributeAliasAttributes & (T extends SVGURIReference ? SVGURIReferenceAttribute : {})

    type SVGURIReferenceAttribute = SVGURIReference | { href?: Attribute<string> }


    type HTMLElements = { [Tag in keyof HTMLElementTagNameMap]: ElementAttributes<HTMLElementTagNameMap[Tag]> & HTMLAttributeAliasAttributes<HTMLElementTagNameMap[Tag]> }
    type SVGElements = { [Tag in keyof SVGElementTagNameMap]: SVGElementAttributes<SVGElementTagNameMap[Tag]> }
    type MathMLElements = { [Tag in keyof MathMLElementTagNameMap]: ElementAttributes<MathMLElementTagNameMap[Tag]> }

    type IntrinsicElementAttributes = HTMLElements & SVGElements & MathMLElements
    interface IntrinsicElements extends IntrinsicElementAttributes { }
  }
}
