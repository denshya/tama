import { WebInflator } from "../../build"
import {
  createTamaJSX,
  createTamaJSXFull,
  createTamaJSXFull_componentsOnly,
  createTamaJSXFull_componentsStyleObjects,
  createTamaJSXFull_componentsStateEvents,
  createTamaJSXFull_componentsClassMods,
} from "./learn-page"

const inflator = new WebInflator
const root = document.createElement("div")
root.id = "bench-root"
document.body.appendChild(root)

const variants = [
  ["flat string styles",       () => createTamaJSX()],
  ["comp string styles",       () => createTamaJSXFull_componentsOnly()],
  ["comp style objects",       () => createTamaJSXFull_componentsStyleObjects()],
  ["comp + state + events",    () => createTamaJSXFull_componentsStateEvents()],
  ["comp + classMods",         () => createTamaJSXFull_componentsClassMods()],
  ["comp full (all features)", () => createTamaJSXFull()],
] as const

const ITERATIONS = 7

for (const [label, create] of variants) {
  const times: number[] = []

  for (let i = 0; i < ITERATIONS; i++) {
    root.textContent = ""
    const start = performance.now()
    root.replaceChildren(inflator.inflate(create()))
    times.push(performance.now() - start)
  }

  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const min = times[0]
  const max = times[times.length - 1]

  console.log(`Tama ${label}: ${median.toFixed(3)}ms (min=${min.toFixed(3)} max=${max.toFixed(3)})`)
}

console.log("done")
