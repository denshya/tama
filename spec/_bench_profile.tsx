import "./happydom"
import { WebInflator } from "../build"

// Count DOM calls by instrumenting the source
// We'll monkey-patch only the methods we safely can
const originalCE = document.createElement.bind(document) as any
const originalCENS = document.createElementNS.bind(document) as any
const originalAC = (Node.prototype as any).appendChild.bind(Node.prototype) as any

let counts: Record<string, number> = {
  createElement: 0, createElementNS: 0, appendChild: 0,
  htmlElement: 0, styleCssText: 0, classNameSet: 0, textContentSet: 0
}

function resetCounts() {
  counts = {
    createElement: 0, createElementNS: 0, appendChild: 0,
    htmlElement: 0, styleCssText: 0, classNameSet: 0, textContentSet: 0
  }
}

document.createElement = function(tag: string, options?: any) {
  counts.createElement++
  return originalCE(tag, options)
} as any

document.createElementNS = function(ns: string, tag: string, options?: any) {
  counts.createElementNS++
  return originalCENS(ns, tag, options)
} as any

;(Node.prototype as any).appendChild = function<T extends Node>(child: T) {
  counts.appendChild++
  return originalAC(child)
} as any

// Instrument constructor to count className/style/textContent sets
const OrigDescriptor = Object.getOwnPropertyDescriptor
const OrigDefineProp = Object.defineProperty

// Patch element creation to instrument className, style, textContent
const origDivCreate = document.createElement.bind(document)
const instrumentedCreate = function(tag: string, options?: any) {
  const el = origDivCreate(tag, options)
  // Wrap style.cssText
  if (el.style) {
    const origCssText = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el.style), 'cssText')
    if (origCssText?.set) {
      const origSet = origCssText.set
      Object.defineProperty(el.style, 'cssText', {
        set(value: string) {
          counts.styleCssText++
          return origSet.call(el.style, value)
        },
        get() { return '' }
      })
    }
  }
  // Wrap className
  Object.defineProperty(el, 'className', {
    set(value: string) {
      counts.classNameSet++
    },
    get() { return '' }
  })
  return el
}
document.createElement = instrumentedCreate as any
// Also instrument createElementNS
const origDivCreateNS = document.createElementNS.bind(document)
document.createElementNS = function(ns: string, tag: string, options?: any) {
  const el = origDivCreateNS(ns, tag, options)
  Object.defineProperty(el, 'className', {
    set(value: string) { counts.classNameSet++ },
    get() { return '' }
  })
  return el
} as any

function createLearnPageJSX(): any {
  return (
    <div id="app-root">
      <header id="topbar" style="position: sticky; top: 0; z-index: 100;">
        <div className="container" style="max-width: 1300px; margin: 0 auto;">
          <a href="/" className="logo">
            <svg viewBox="0 0 25 25" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style="font-weight: 700;">Tama</span>
          </a>
          <nav className="navbar" />
          <div className="secondary-links">
            <a href="https://github.com" aria-label="GitHub"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg></a>
          </div>
        </div>
      </header>
      <main style="display: flex;">
        <aside style="min-width: 15em;">
          <nav className="sidebar">
            <ul>
              <li><span>Getting Started</span><ul><li><a href="/learn">Learn</a></li></ul></li>
              <li><a href="/guide">Guide</a></li>
            </ul>
          </nav>
        </aside>
        <article style="flex: 1;">
          <div className="md-content">
            <h1>Getting Started</h1>
            <p>Welcome to Tama!</p>
            <h2>Install</h2>
            <div className="code-block"><div className="code-header">Terminal</div><pre><code>npm install tama</code></pre></div>
            <h2>Quick Start</h2>
            <div className="code-block"><div className="code-header">App.tsx</div><pre><code>import { WebInflator } from "@denshya/proton"</code></pre></div>
            <blockquote className="admonition tip"><strong>TIP:</strong> Tama renders to real DOM.</blockquote>
            <ul><li>No virtual DOM</li><li>Fine-grained reactivity</li></ul>
          </div>
        </article>
      </main>
      <footer><div>Copyright</div></footer>
    </div>
  )
}

const inflator = new WebInflator
const jsx = createLearnPageJSX()

resetCounts()
inflator.inflate(jsx)
console.log("\n=== DOM API Call Counts ===")
console.log(JSON.stringify(counts, null, 2))
const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0)
console.log(`Total DOM API calls: ${total}`)
