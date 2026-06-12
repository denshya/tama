import { render } from "inferno"
import { createLearnPageInferno, createLearnPageInfernoFull } from "./inferno-tree"

const root = document.createElement("div")
root.id = "bench-root"
document.body.appendChild(root)

const variants = [
  ["static (string styles)", createLearnPageInferno],
  ["full (components + style objects + events)", createLearnPageInfernoFull],
] as const

const ITERATIONS = 7

for (const [label, create] of variants) {
  const times: number[] = []

  for (let i = 0; i < ITERATIONS; i++) {
    root.textContent = ""
    const start = performance.now()
    render(create(), root)
    times.push(performance.now() - start)
  }

  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const min = times[0]
  const max = times[times.length - 1]

  console.log(`Inferno ${label}: ${median.toFixed(3)}ms (min=${min.toFixed(3)} max=${max.toFixed(3)})`)
}

console.log("done")
