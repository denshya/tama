import { WebInflator } from "../../build"
import { render } from "inferno"
import { h } from "inferno-hyperscript"

// Shared helpers
const _mainStyle = { maxWidth: "800px", margin: "0 auto", padding: "2rem" }
const _asideStyle = { borderLeft: "1px solid #ccc", padding: "1rem" }
const _articleStyle = { marginBottom: "2rem" }

function tamaTree() {
  return (
    <div style={_mainStyle}>
      <nav className="sidebar">
        <a className="sidebar-header" href="/">Tama Docs</a>
        <div style={{ marginTop: "2rem" }}>
          <span style={{ fontWeight: 700 }}>Getting Started</span>
          <a href="/learn" className="sidebar-link">Learn</a>
          <a href="/setup" className="sidebar-link">Setup</a>
          <a href="/tutorial" className="sidebar-link">Tutorial</a>
          <a href="/faq" className="sidebar-link">FAQ</a>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <span style={{ fontWeight: 700 }}>Core Concepts</span>
          <a href="/components" className="sidebar-link">Components</a>
          <a href="/state" className="sidebar-link">State</a>
          <a href="/events" className="sidebar-link">Events</a>
          <a href="/lifecycle" className="sidebar-link">Lifecycle</a>
        </div>
      </nav>
      <main>
        <header>
          <h1 style="font-size: 2.25rem; font-weight: 700; margin-bottom: 0.5rem;">Getting Started</h1>
          <p>A guide to help you start building with Tama.</p>
        </header>
        <article style={_articleStyle}>
          <h2>Installation</h2>
          <p>Install Tama via your preferred package manager.</p>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;"><code>npm install @denshya/tama</code></pre>
        </article>
        <article style={_articleStyle}>
          <h2>Your First Component</h2>
          <p>Tama components are functions that return JSX elements.</p>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;"><code>function App() {'{'} return {'<'}h1{'>'}Hello{'<'}/h1{'>'} {'}'}</code></pre>
        </article>
      </main>
      <aside style={_asideStyle}>
        <h3>On this page</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="#installation">Installation</a></li>
          <li><a href="#first-component">First Component</a></li>
          <li><a href="#next-steps">Next Steps</a></li>
        </ul>
      </aside>
    </div>
  )
}

function infernoTree() {
  return h("div", { style: _mainStyle }, [
    h("nav", { className: "sidebar" }, [
      h("a", { className: "sidebar-header", href: "/" }, "Tama Docs"),
      h("div", { style: { marginTop: "2rem" } }, [
        h("span", { style: { fontWeight: 700 } }, "Getting Started"),
        h("a", { className: "sidebar-link", href: "/learn" }, "Learn"),
        h("a", { className: "sidebar-link", href: "/setup" }, "Setup"),
        h("a", { className: "sidebar-link", href: "/tutorial" }, "Tutorial"),
        h("a", { className: "sidebar-link", href: "/faq" }, "FAQ"),
      ]),
      h("div", { style: { marginTop: "2rem" } }, [
        h("span", { style: { fontWeight: 700 } }, "Core Concepts"),
        h("a", { className: "sidebar-link", href: "/components" }, "Components"),
        h("a", { className: "sidebar-link", href: "/state" }, "State"),
        h("a", { className: "sidebar-link", href: "/events" }, "Events"),
        h("a", { className: "sidebar-link", href: "/lifecycle" }, "Lifecycle"),
      ]),
    ]),
    h("main", null, [
      h("header", null, [
        h("h1", { style: "font-size: 2.25rem; font-weight: 700; margin-bottom: 0.5rem;" }, "Getting Started"),
        h("p", null, "A guide to help you start building with Tama."),
      ]),
      h("article", { style: _articleStyle }, [
        h("h2", null, "Installation"),
        h("p", null, "Install Tama via your preferred package manager."),
        h("pre", { style: "background: #f5f5f5; padding: 1rem; border-radius: 4px;" }, [
          h("code", null, "npm install @denshya/tama"),
        ]),
      ]),
      h("article", { style: _articleStyle }, [
        h("h2", null, "Your First Component"),
        h("p", null, "Tama components are functions that return JSX elements."),
        h("pre", { style: "background: #f5f5f5; padding: 1rem; border-radius: 4px;" }, [
          h("code", null, "function App() { return <h1>Hello</h1> }"),
        ]),
      ]),
    ]),
    h("aside", { style: _asideStyle }, [
      h("h3", null, "On this page"),
      h("ul", { style: { listStyle: "none", padding: 0 } }, [
        h("li", null, [h("a", { href: "#installation" }, "Installation")]),
        h("li", null, [h("a", { href: "#first-component" }, "First Component")]),
        h("li", null, [h("a", { href: "#next-steps" }, "Next Steps")]),
      ]),
    ]),
  ])
}

const root = document.createElement("div")
root.id = "bench-root"
document.body.appendChild(root)

const N = 500
const runs = 10

// Phase 1: Tama JSX creation only
{
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    const t1 = performance.now()
    for (let j = 0; j < N; j++) tamaTree()
    times.push((performance.now() - t1) / N)
  }
  times.sort((a, b) => a - b)
  const med = times[Math.floor(times.length / 2)]
  console.log(`Tama JSX creation: ${(med * 1000).toFixed(2)}µs`)
}

// Phase 2: Tama inflation (with JSX creation within loop)
{
  const times: number[] = []
  const inflator = new WebInflator
  for (let i = 0; i < runs; i++) {
    root.textContent = ""
    const t1 = performance.now()
    for (let j = 0; j < N; j++) root.replaceChildren(inflator.inflate(tamaTree()))
    times.push((performance.now() - t1) / N)
  }
  times.sort((a, b) => a - b)
  const med = times[Math.floor(times.length / 2)]
  console.log(`Tama inflation (total): ${(med * 1000).toFixed(2)}µs`)
}

// Phase 4: Inferno
{
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    root.textContent = ""
    try { render(null, root) } catch (_) {}
    const t1 = performance.now()
    for (let j = 0; j < N; j++) render(infernoTree(), root)
    times.push((performance.now() - t1) / N)
  }
  times.sort((a, b) => a - b)
  const med = times[Math.floor(times.length / 2)]
  console.log(`Inferno render (total): ${(med * 1000).toFixed(2)}µs`)
}

// Phase 5: Inferno createElement only
{
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    const t1 = performance.now()
    for (let j = 0; j < N; j++) infernoTree()
    times.push((performance.now() - t1) / N)
  }
  times.sort((a, b) => a - b)
  const med = times[Math.floor(times.length / 2)]
  console.log(`Inferno VNode creation: ${(med * 1000).toFixed(2)}µs`)
}

console.log("done")
