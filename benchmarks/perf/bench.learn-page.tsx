import "./happydom"
import { bench } from "benchik"
import { WebInflator } from "../../build"
import {
  createTamaJSX,
  createTamaJSXFull,
  createTamaJSX_styleObjects,
  createTamaJSXFull_componentsOnly,
  createTamaJSXFull_componentsStyleObjects,
  createTamaJSXFull_componentsStateEvents,
  createTamaJSXFull_componentsClassMods,
} from "./learn-page"

const inflator = new WebInflator

function LearnPage(): JSX.Element {
  return createTamaJSX()
}

function LearnPageStyleObj(): JSX.Element {
  return createTamaJSX_styleObjects()
}

function LearnPageFull_componentsOnly(): JSX.Element {
  return createTamaJSXFull_componentsOnly()
}

function LearnPageFull_componentsStyleObjects(): JSX.Element {
  return createTamaJSXFull_componentsStyleObjects()
}

function LearnPageFull_componentsStateEvents(): JSX.Element {
  return createTamaJSXFull_componentsStateEvents()
}

function LearnPageFull_componentsClassMods(): JSX.Element {
  return createTamaJSXFull_componentsClassMods()
}

function LearnPageFull(): JSX.Element {
  return createTamaJSXFull()
}

const mountTarget = document.createElement("div")
document.body.appendChild(mountTarget)

await bench.untilCompiled()

// ─── Group A: JSX Creation ───────────────────────────────────────
{
  using g = bench.group("JSX Creation")

  bench("flat, string styles", () => { createTamaJSX() })
  bench("flat, style objects", () => { createTamaJSX_styleObjects() })
  bench("components, string styles", () => { createTamaJSXFull_componentsOnly() })
  bench("components, style objects", () => { createTamaJSXFull_componentsStyleObjects() })
  bench("components + state + events", () => { createTamaJSXFull_componentsStateEvents() })
  bench("components + classMods", () => { createTamaJSXFull_componentsClassMods() })
  bench("components + mounted (full)", () => { createTamaJSXFull() })
}

// ─── Group B: Inflation (JSX → detached DOM) ─────────────────────
{
  using g = bench.group("Inflation")
  const f = g.fresh(() => ({
    raw: createTamaJSX(),
    styleObj: createTamaJSX_styleObjects(),
    compOnly: createTamaJSXFull_componentsOnly(),
    compStyleObj: createTamaJSXFull_componentsStyleObjects(),
    compStateEvents: createTamaJSXFull_componentsStateEvents(),
    compClassMods: createTamaJSXFull_componentsClassMods(),
    compFull: createTamaJSXFull(),
  }))

  bench("flat, string styles", () => { inflator.inflate(f.raw) })
  bench("flat, style objects", () => { inflator.inflate(f.styleObj) })
  bench("components, string styles", () => { inflator.inflate(f.compOnly) })
  bench("components, style objects", () => { inflator.inflate(f.compStyleObj) })
  bench("components + state + events", () => { inflator.inflate(f.compStateEvents) })
  bench("components + classMods", () => { inflator.inflate(f.compClassMods) })
  bench("components + mounted (full)", () => { inflator.inflate(f.compFull) })
}

// ─── Group C: Mount (inflate + attach to live document) ──────────
{
  using g = bench.group("Mount")
  const f = g.fresh(() => ({
    raw: createTamaJSX(),
    styleObj: createTamaJSX_styleObjects(),
    compOnly: createTamaJSXFull_componentsOnly(),
    compStyleObj: createTamaJSXFull_componentsStyleObjects(),
    compStateEvents: createTamaJSXFull_componentsStateEvents(),
    compClassMods: createTamaJSXFull_componentsClassMods(),
    compFull: createTamaJSXFull(),
  }))

  bench("flat, string styles", () => {
    mountTarget.replaceChildren(inflator.inflate(f.raw))
  })

  bench("flat, style objects", () => {
    mountTarget.replaceChildren(inflator.inflate(f.styleObj))
  })

  bench("components, string styles", () => {
    mountTarget.replaceChildren(inflator.inflate(f.compOnly))
  })

  bench("components, style objects", () => {
    mountTarget.replaceChildren(inflator.inflate(f.compStyleObj))
  })

  bench("components + state + events", () => {
    mountTarget.replaceChildren(inflator.inflate(f.compStateEvents))
  })

  bench("components + classMods", () => {
    mountTarget.replaceChildren(inflator.inflate(f.compClassMods))
  })

  bench("components + mounted (full)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.compFull))
  })
}
