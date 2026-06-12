import "./happydom"
import { bench } from "benchik"
import { WebInflator } from "../../build"
import { createTamaJSX, createTamaJSXFull } from "./learn-page"

const inflator = new WebInflator

function LearnPage(): JSX.Element {
  return createTamaJSX()
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

  bench("ProtonJSX.Element (static)", () => {
    createTamaJSX()
  })

  bench("ProtonJSX.Element (full)", () => {
    createTamaJSXFull()
  })
}

// ─── Group B: Inflation (JSX → detached DOM) ─────────────────────
{
  using g = bench.group("Inflation")
  const f = g.fresh(() => ({
    comp: { type: LearnPage, props: {} } as JSX.Element,
    raw: createTamaJSX(),
    full: { type: LearnPageFull, props: {} } as JSX.Element,
    rawFull: createTamaJSXFull(),
  }))

  bench("WebInflator.inflate (component, static)", () => {
    inflator.inflate(f.comp)
  })

  bench("WebInflator.inflate (raw, static)", () => {
    inflator.inflate(f.raw)
  })

  bench("WebInflator.inflate (component, full)", () => {
    inflator.inflate(f.full)
  })

  bench("WebInflator.inflate (raw, full)", () => {
    inflator.inflate(f.rawFull)
  })
}

// ─── Group C: Mount (create + attach to live document) ───────────
{
  using g = bench.group("Mount")
  const f = g.fresh(() => ({
    comp: { type: LearnPage, props: {} } as JSX.Element,
    raw: createTamaJSX(),
    full: { type: LearnPageFull, props: {} } as JSX.Element,
    rawFull: createTamaJSXFull(),
  }))

  bench("replaceChildren (component, static)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.comp))
  })

  bench("replaceChildren (raw, static)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.raw))
  })

  bench("replaceChildren (component, full)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.full))
  })

  bench("replaceChildren (raw, full)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.rawFull))
  })
}
