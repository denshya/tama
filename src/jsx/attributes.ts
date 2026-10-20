/**
 * Attribute spellings that differ from their DOM property names.
 *
 * The inflator accepts both spellings and normalizes them before binding. HTML
 * aliases resolve to DOM property names so reflection keeps boolean and form
 * behavior intact. SVG aliases resolve to the real attribute name because SVG
 * attribute names are case-sensitive.
 */
export const htmlAttributeAliases = {
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  class: "className",
  colspan: "colSpan",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  for: "htmlFor",
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  playsinline: "playsInline",
  readonly: "readOnly",
  rowspan: "rowSpan",
  tabindex: "tabIndex",
  usemap: "useMap",
} as const

export const svgAttributeAliases = {
  alignmentBaseline: "alignment-baseline",
  baselineShift: "baseline-shift",
  clipPath: "clip-path",
  clipRule: "clip-rule",
  colorInterpolation: "color-interpolation",
  colorInterpolationFilters: "color-interpolation-filters",
  colorProfile: "color-profile",
  colorRendering: "color-rendering",
  dominantBaseline: "dominant-baseline",
  fillOpacity: "fill-opacity",
  fillRule: "fill-rule",
  floodColor: "flood-color",
  floodOpacity: "flood-opacity",
  fontFamily: "font-family",
  fontSize: "font-size",
  fontSizeAdjust: "font-size-adjust",
  fontStretch: "font-stretch",
  fontStyle: "font-style",
  fontVariant: "font-variant",
  fontWeight: "font-weight",
  glyphOrientationHorizontal: "glyph-orientation-horizontal",
  glyphOrientationVertical: "glyph-orientation-vertical",
  imageRendering: "image-rendering",
  letterSpacing: "letter-spacing",
  lightingColor: "lighting-color",
  markerEnd: "marker-end",
  markerMid: "marker-mid",
  markerStart: "marker-start",
  maskType: "mask-type",
  mixBlendMode: "mix-blend-mode",
  paintOrder: "paint-order",
  pointerEvents: "pointer-events",
  shapeRendering: "shape-rendering",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  strokeDasharray: "stroke-dasharray",
  strokeDashoffset: "stroke-dashoffset",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeMiterlimit: "stroke-miterlimit",
  strokeOpacity: "stroke-opacity",
  strokeWidth: "stroke-width",
  textAnchor: "text-anchor",
  textDecoration: "text-decoration",
  textRendering: "text-rendering",
  transformOrigin: "transform-origin",
  unicodeBidi: "unicode-bidi",
  vectorEffect: "vector-effect",
  wordSpacing: "word-spacing",
  writingMode: "writing-mode",
} as const

const htmlAttributeNames: Record<string, string> = {}
for (const [attribute, property] of Object.entries(htmlAttributeAliases)) {
  htmlAttributeNames[property] = attribute
}

/** Resolves either accepted spelling to the key used for binding and unbinding. */
export function normalizeAttributeName(name: string, isSVG: boolean): string {
  if (isSVG) {
    if (name === "className") return "class"
    if (name === "tabIndex") return "tabindex"
    return svgAttributeAliases[name as keyof typeof svgAttributeAliases] ?? name
  }
  return htmlAttributeAliases[name as keyof typeof htmlAttributeAliases] ?? name
}

/** Resolves a normalized DOM property name to the attribute it reflects into. */
export function attributeNameForProperty(property: string, isSVG: boolean): string {
  if (isSVG) return property
  return htmlAttributeNames[property] ?? property
}

/** Attributes keep exact, case-sensitive names; HTML properties handle their own reflection. */
export function bindsAsAttribute(name: string, isSVG: boolean): boolean {
  return isSVG || name === "role" || name.includes("-")
}
