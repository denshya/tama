import "./happydom"
import { bench } from "benchik"
import { learnPageHTML } from "./learn-page"


const referenceDOM = (() => {
  const d = document.createElement("div")
  d.innerHTML = learnPageHTML
  return d
})()

const mountTarget = document.createElement("div")
document.body.appendChild(mountTarget)

await bench.untilCompiled()

{
  using g = bench.group("DOM Creation")

  const f = g.fresh(() => ({
    container: document.createElement("div"),
  }))

  bench("innerHTML", () => {
    f.container.innerHTML = learnPageHTML
  })

  bench("cloneNode(true)", () => {
    referenceDOM.cloneNode(true)
  })
}

{
  using g = bench.group("DOM Mount")

  const f = g.fresh(() => ({
    container: document.createElement("div"),
  }))

  bench("innerHTML → mount", () => {
    mountTarget.innerHTML = learnPageHTML
  })

  bench("cloneNode(true) → replaceChildren", () => {
    mountTarget.replaceChildren(referenceDOM.cloneNode(true))
  })
}
