import { WebInflator } from "../../build"
import { render } from "inferno"
import {
  createTamaJSX,
  createTamaJSXFull,
  createTamaJSX_styleObjects,
  createTamaJSXFull_componentsOnly,
  createTamaJSXFull_componentsStyleObjects,
  createTamaJSXFull_componentsStateEvents,
  createTamaJSXFull_componentsClassMods,
} from "./learn-page"
import { createLearnPageInferno, createLearnPageInfernoFull } from "./inferno-tree"

const inflator = new WebInflator
const NUM_ITERATIONS = 5

// Each bench case: (label, fn) where fn() returns a DOM node or renders into body
interface BenchCase {
  label: string
  run: (container: HTMLElement) => void
}

const benches: BenchCase[] = [
  // ── Tama: flat tree ──
  {
    label: "Tama flat, string styles",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSX())) },
  },
  {
    label: "Tama flat, style objects",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSX_styleObjects())) },
  },
  // ── Tama: component tree incremental ──
  {
    label: "Tama components, string styles",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSXFull_componentsOnly())) },
  },
  {
    label: "Tama components, style objects",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSXFull_componentsStyleObjects())) },
  },
  {
    label: "Tama + state + events",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSXFull_componentsStateEvents())) },
  },
  {
    label: "Tama + classMods",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSXFull_componentsClassMods())) },
  },
  {
    label: "Tama full (all features)",
    run: (c) => { c.replaceChildren(inflator.inflate(createTamaJSXFull())) },
  },
  // ── Inferno ──
  {
    label: "Inferno static (string styles)",
    run: (c) => { render(createLearnPageInferno(), c) },
  },
  {
    label: "Inferno full (components + style objects + events)",
    run: (c) => { render(createLearnPageInfernoFull(), c) },
  },
]

function runAll() {
  const root = document.getElementById("bench-root") ?? (() => {
    const r = document.createElement("div")
    r.id = "bench-root"
    document.body.appendChild(r)
    return r
  })()

  for (const b of benches) {
    const times: number[] = []

    for (let i = 0; i < NUM_ITERATIONS; i++) {
      root.innerHTML = ""
      // Force layout clear
      void root.offsetHeight

      const start = performance.now()
      b.run(root)
      const end = performance.now()

      times.push(end - start)
    }

    times.sort((a, b) => a - b)
    const min = times[0]
    const max = times[times.length - 1]
    const avg = times.reduce((s, t) => s + t, 0) / times.length
    const median = times[Math.floor(times.length / 2)]

    console.log(`${b.label}: median=${median.toFixed(3)}ms avg=${avg.toFixed(3)}ms min=${min.toFixed(3)}ms max=${max.toFixed(3)}ms`)
  }

  console.log("Benchmark complete")
}

runAll()
