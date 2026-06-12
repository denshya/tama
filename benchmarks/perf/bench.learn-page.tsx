import "./happydom"
import { bench } from "benchik"
import { WebInflator } from "../../build"
import { createTamaJSX } from "./learn-page"

const inflator = new WebInflator

function LearnPage(): JSX.Element {
  return createTamaJSX()
}

const mountTarget = document.createElement("div")
document.body.appendChild(mountTarget)

await bench.untilCompiled()

// ─── Group A: JSX Creation ───────────────────────────────────────
{
  using g = bench.group("JSX Creation")

  bench("ProtonJSX.Element", () => {
    createTamaJSX()
  })
}

// ─── Group B: Inflation (JSX → DOM) ──────────────────────────────
{
  using g = bench.group("Inflation")
  const f = g.fresh(() => ({
    comp: { type: LearnPage, props: {} } as JSX.Element,
    raw: createTamaJSX(),
  }))

  bench("WebInflator.inflate (component)", () => {
    inflator.inflate(f.comp)
  })

  bench("WebInflator.inflate (raw JSX)", () => {
    inflator.inflate(f.raw)
  })
}

// ─── Group C: Mount (append to live document) ────────────────────
{
  using g = bench.group("Mount")
  const f = g.fresh(() => ({
    comp: { type: LearnPage, props: {} } as JSX.Element,
    raw: createTamaJSX(),
  }))

  bench("replaceChildren (component)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.comp))
  })

  bench("replaceChildren (raw JSX)", () => {
    mountTarget.replaceChildren(inflator.inflate(f.raw))
  })
}
