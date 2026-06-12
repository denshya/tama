import { State } from "@denshya/reactive"
import { WebJSXSerializer } from "../../build"


export function createTamaJSX() {
  return (
    <div id="app-root">
      <header id="topbar" style="position: sticky; top: 0; z-index: 100;">
        <div className="container" style="max-width: 1300px; margin: 0 auto; display: flex; align-items: center; padding: 0.5em 1em;">
          <a href="/" className="logo" style="display: flex; align-items: center; gap: 0.5em; text-decoration: none; color: inherit;">
            <svg viewBox="0 0 25 25" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style="font-weight: 700; font-size: 1.125rem;">Tama</span>
          </a>
          <nav className="navbar" style="flex: 1; display: flex; justify-content: center;" />
          <div className="secondary-links" style="display: flex; gap: 0.75em; align-items: center;">
            <a href="https://github.com" aria-label="GitHub" style="color: #666;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </a>
            <a href="https://discord.com" aria-label="Discord" style="color: #666;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
            </a>
            <a href="https://bsky.app" aria-label="Bluesky" style="color: #666;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.023 0 1.62 0 4.2c0 .84.48 7.08.756 8.1.972 3.468 4.512 4.344 7.656 3.792-5.352 1.152-6.72 4.296-3.864 6.096 5.712 3.6 7.452-2.076 7.452-6.396V4.956c0-.42-.336-.756-.756-.756-2.52 0-5.412 4.776-6.588 6.636z" /></svg>
            </a>
          </div>
        </div>
      </header>
      <main style="display: flex; gap: 2.5em; max-width: 1300px; margin: 0 auto; padding: 1em;">
        <aside style="min-width: 15em; position: sticky; top: 4em; align-self: flex-start; max-height: calc(100vh - 5em); overflow-y: auto;">
          <nav className="sidebar">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.25em;">
                <span style="display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; cursor: pointer; font-weight: 600; font-size: 0.875rem; color: #171717;">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="transition: transform 0.2s;"><path d="M6 4l4 4-4 4" /></svg>
                  Getting Started
                </span>
                <ul style="list-style: none; padding: 0; margin: 0 0 0 1.25em;">
                  <li><a href="/learn" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none; background: rgba(0,0,0,0.05);">Learn</a></li>
                  <li><a href="/installation" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">Installation</a></li>
                  <li><a href="/quick-start" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">Quick Start</a></li>
                </ul>
              </li>
              <li style="margin-bottom: 0.25em;">
                <a href="/guide" style="display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none;">Guide</a>
              </li>
              <li style="margin-bottom: 0.25em;">
                <span style="display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; cursor: pointer; font-weight: 600; font-size: 0.875rem; color: #171717;">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="transition: transform 0.2s;"><path d="M6 4l4 4-4 4" /></svg>
                  API Reference
                </span>
                <ul style="list-style: none; padding: 0; margin: 0 0 0 1.25em;">
                  <li><a href="/api/state" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">State</a></li>
                  <li><a href="/api/component" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">Component</a></li>
                  <li><a href="/api/inflator" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">Inflator</a></li>
                  <li><a href="/api/jsx" style="display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">JSX</a></li>
                </ul>
              </li>
              <li style="margin-bottom: 0.25em;">
                <a href="/examples" style="display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none;">Examples</a>
              </li>
              <li style="margin-bottom: 0.25em;">
                <a href="/blog" style="display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;">Blog</a>
              </li>
            </ul>
          </nav>
        </aside>
        <article style="flex: 1; min-width: 0;">
          <nav className="breadcrumbs" style="margin-bottom: 1em; font-size: 0.875rem; color: #666;">
            <ol style="list-style: none; padding: 0; margin: 0; display: flex; align-items: center; gap: 0.5em;">
              <li style="display: flex; align-items: center; gap: 0.5em;">
                <a href="/" style="color: #666; text-decoration: none;">Home</a>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
              </li>
              <li style="display: flex; align-items: center; gap: 0.5em;">
                <a href="/learn" style="color: #666; text-decoration: none;">Learn</a>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
              </li>
              <li style="display: flex; align-items: center; gap: 0.5em;">
                <span style="color: #171717; background: rgba(0,0,0,0.05); padding: 0.125em 0.375em; border-radius: 0.25em;">Getting Started</span>
              </li>
            </ol>
          </nav>
          <div className="md-content" style="line-height: 1.5;">
            <h1 style="font-size: 2.25rem; font-weight: 700; margin: 0 0 0.5em; color: #171717;">Getting Started</h1>
            <p style="margin: 0 0 0.75em; color: #333;">Welcome to Tama! This guide will help you get started building applications with fine-grained reactivity and direct DOM rendering.</p>
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;">Install</h2>
            <p style="margin: 0 0 0.75em; color: #333;">Run the following command in your terminal:</p>
            <div className="code-block" style="background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;">
              <div className="code-header" style="padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;">Terminal</div>
              <pre style="padding: 1em; margin: 0; overflow-x: auto;"><code style="font-family: monospace; font-size: 0.875rem; line-height: 1.4;">bun i @denshya/proton @denshya/reactive</code></pre>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;">Setup</h2>
            <p style="margin: 0 0 0.75em; color: #333;">Configure your <code style="background: #f6f8fa; padding: 0.125em 0.375em; border-radius: 0.25em; font-size: 0.85em;">tsconfig.json</code> to use Tama as the JSX runtime:</p>
            <div className="code-block" style="background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;">
              <div className="code-header" style="padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;">tsconfig.json</div>
              <pre style="padding: 1em; margin: 0; overflow-x: auto;"><code style="font-family: monospace; font-size: 0.875rem; line-height: 1.4;">{`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@denshya/proton/jsx/virtual"
  }
}`}</code></pre>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;">Quick Start</h2>
            <p style="margin: 0 0 0.75em; color: #333;">Here's a simple counter app to get you started:</p>
            <div className="code-block" style="background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;">
              <div className="code-header" style="padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;">App.tsx</div>
              <pre style="padding: 1em; margin: 0; overflow-x: auto;"><code style="font-family: monospace; font-size: 0.875rem; line-height: 1.4;">{`import { State } from "@denshya/reactive"
import { WebInflator } from "@denshya/proton"

const count = new State(0)
const inflator = new WebInflator

document.body.appendChild(
  inflator.inflate(
    <button onclick={() => count.set(count.get() + 1)}>
      Count: {count}
    </button>
  )
)`}</code></pre>
            </div>
            <blockquote className="admonition tip" style="margin: 1em 0; padding: 0.75em 1em; border-left: 4px solid #2b82d9; background: #f0f7ff; border-radius: 0.375em;">
              <strong style="color: #171717;">TIP:</strong> Tama directly renders to real DOM elements — no virtual DOM overhead. Each reactive binding updates only the specific DOM nodes that changed.
            </blockquote>
            <blockquote className="admonition note" style="margin: 1em 0; padding: 0.75em 1em; border-left: 4px solid #6b7280; background: #f9fafb; border-radius: 0.375em;">
              <strong style="color: #171717;">NOTE:</strong> Components in Tama are not functions — they are JSX trees. There are no hooks, no diffing, and no reconciliation algorithm.
            </blockquote>
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;">React Developers: The Short Version</h2>
            <ul style="margin: 0 0 0.75em; padding-left: 1.5em; color: #333;">
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>No virtual DOM — direct DOM manipulation via WebInflator</li>
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>Components are JSX trees, not function calls</li>
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>State management via <code style="background: #f6f8fa; padding: 0.125em 0.375em; border-radius: 0.25em; font-size: 0.85em;">@denshya/reactive</code></li>
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>Fine-grained reactivity — only changed nodes update</li>
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>No hooks — just state bindings and JSX</li>
              <li style="margin-bottom: 0.375em;"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="margin-right: 0.375em;"><path d="M6 4l4 4-4 4" /></svg>Built for performance from the ground up</li>
            </ul>
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;">Next Steps</h2>
            <p style="margin: 0 0 0.75em; color: #333;">Continue reading to learn more about:</p>
            <ul style="margin: 0 0 0.75em; padding-left: 1.5em; color: #333;">
              <li style="margin-bottom: 0.375em;"><a href="/guide/reactivity" style="color: #2b82d9; text-decoration: none;">Reactivity</a> — Understanding fine-grained state management</li>
              <li style="margin-bottom: 0.375em;"><a href="/guide/components" style="color: #2b82d9; text-decoration: none;">Components</a> — Building reusable JSX trees</li>
              <li style="margin-bottom: 0.375em;"><a href="/guide/inflation" style="color: #2b82d9; text-decoration: none;">Inflation</a> — How JSX becomes DOM</li>
              <li style="margin-bottom: 0.375em;"><a href="/examples" style="color: #2b82d9; text-decoration: none;">Examples</a> — Real-world usage patterns</li>
            </ul>
          </div>
        </article>
      </main>
      <footer style="border-top: 1px solid #e1e4e8; margin-top: 3em; background: #f6f8fa;">
        <div className="footer-top" style="max-width: 1300px; margin: 0 auto; padding: 1.5em 1em; display: flex; justify-content: space-between; align-items: center;">
          <div className="footer-logo" style="display: flex; align-items: center; gap: 0.5em;">
            <svg viewBox="0 0 25 25" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style="font-weight: 600;">Tama</span>
          </div>
          <div className="footer-links" style="display: flex; gap: 1.5em;">
            <a href="/blog" style="color: #666; text-decoration: none; font-size: 0.875rem;">Blog</a>
            <a href="/schedule" style="color: #666; text-decoration: none; font-size: 0.875rem;">Schedule</a>
          </div>
        </div>
        <div className="footer-bottom" style="max-width: 1300px; margin: 0 auto; padding: 1em; border-top: 1px solid #e1e4e8; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #666;">
          <span>&copy; 2025 Denshya. All rights reserved.</span>
          <div className="footer-legal" style="display: flex; gap: 1em;">
            <a href="/privacy" style="color: #666; text-decoration: none;">Privacy</a>
            <a href="/terms" style="color: #666; text-decoration: none;">Terms</a>
            <a href="/cookies" style="color: #666; text-decoration: none;">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}


// ─── Full Tama tree with components, style objects, reactivity ────

function Topbar() {
  return (
    <header id="topbar" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", padding: "0.5em 1em" }}>
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: "0.5em", textDecoration: "none", color: "inherit" }}>
          <svg viewBox="0 0 25 25" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Tama</span>
        </a>
        <nav className="navbar" style={{ flex: 1, display: "flex", justifyContent: "center" }} />
        <div className="secondary-links" style={{ display: "flex", gap: "0.75em", alignItems: "center" }}>
          <a href="https://github.com" aria-label="GitHub" style={{ color: "#666" }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
          </a>
          <a href="https://discord.com" aria-label="Discord" style={{ color: "#666" }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
          </a>
          <a href="https://bsky.app" aria-label="Bluesky" style={{ color: "#666" }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.023 0 1.62 0 4.2c0 .84.48 7.08.756 8.1.972 3.468 4.512 4.344 7.656 3.792-5.352 1.152-6.72 4.296-3.864 6.096 5.712 3.6 7.452-2.076 7.452-6.396V4.956c0-.42-.336-.756-.756-.756-2.52 0-5.412 4.776-6.588 6.636z" /></svg>
          </a>
        </div>
      </div>
    </header>
  )
}

interface SidebarProps {
  activeRoute: State<string>
  expandedFolders: State<Set<string>>
}

function Sidebar(props: SidebarProps) {
  const isLearnActive = props.activeRoute.is("learn")
  const isGuideActive = props.activeRoute.is("guide")
  const isExamplesActive = props.activeRoute.is("examples")
  const isBlogActive = props.activeRoute.is("blog")
  const isGSExpanded = props.expandedFolders.to(s => s.has("getting-started"))
  const isApiExpanded = props.expandedFolders.to(s => s.has("api"))

  const toggleGS = () => {
    const s = props.expandedFolders.get()
    s.has("getting-started") ? s.delete("getting-started") : s.add("getting-started")
    props.expandedFolders.set(s)
  }
  const toggleApi = () => {
    const s = props.expandedFolders.get()
    s.has("api") ? s.delete("api") : s.add("api")
    props.expandedFolders.set(s)
  }

  return (
    <nav className="sidebar">
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: "0.25em" }}>
          <span classMods={{ expanded: isGSExpanded }} style={{ display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "#171717" }} onclick={toggleGS}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ transition: "transform 0.2s" }}><path d="M6 4l4 4-4 4" /></svg>
            Getting Started
          </span>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0 1.25em" }}>
            <li><a href="/learn" classMods={{ active: isLearnActive }} style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none", background: "rgba(0,0,0,0.05)" }}>Learn</a></li>
            <li><a href="/installation" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>Installation</a></li>
            <li><a href="/quick-start" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>Quick Start</a></li>
          </ul>
        </li>
        <li style={{ marginBottom: "0.25em" }}>
          <a href="/guide" classMods={{ active: isGuideActive }} style={{ display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none" }}>Guide</a>
        </li>
        <li style={{ marginBottom: "0.25em" }}>
          <span classMods={{ expanded: isApiExpanded }} style={{ display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "#171717" }} onclick={toggleApi}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ transition: "transform 0.2s" }}><path d="M6 4l4 4-4 4" /></svg>
            API Reference
          </span>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0 1.25em" }}>
            <li><a href="/api/state" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>State</a></li>
            <li><a href="/api/component" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>Component</a></li>
            <li><a href="/api/inflator" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>Inflator</a></li>
            <li><a href="/api/jsx" style={{ display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>JSX</a></li>
          </ul>
        </li>
        <li style={{ marginBottom: "0.25em" }}>
          <a href="/examples" classMods={{ active: isExamplesActive }} style={{ display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none" }}>Examples</a>
        </li>
        <li style={{ marginBottom: "0.25em" }}>
          <a href="/blog" classMods={{ active: isBlogActive }} style={{ display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" }}>Blog</a>
        </li>
      </ul>
    </nav>
  )
}

function Breadcrumbs_(props: { breadcrumbPath: State<string> }) {
  const segments = props.breadcrumbPath.to(path => path.split("/"))

  return (
    <nav className="breadcrumbs" style={{ marginBottom: "1em", fontSize: "0.875rem", color: "#666" }}>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", alignItems: "center", gap: "0.5em" }}>
        <li style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <a href="/" style={{ color: "#666", textDecoration: "none" }}>Home</a>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <a href="/learn" style={{ color: "#666", textDecoration: "none" }}>Learn</a>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <span style={{ color: "#171717", background: "rgba(0,0,0,0.05)", padding: "0.125em 0.375em", borderRadius: "0.25em" }}>{segments}</span>
        </li>
      </ol>
    </nav>
  )
}

function PageContent() {
  return (
    <div className="md-content" style={{ lineHeight: 1.5 }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: "0 0 0.5em", color: "#171717" }}>Getting Started</h1>
      <p style={{ margin: "0 0 0.75em", color: "#333" }}>Welcome to Tama! This guide will help you get started building applications with fine-grained reactivity and direct DOM rendering.</p>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" }}>Install</h2>
      <p style={{ margin: "0 0 0.75em", color: "#333" }}>Run the following command in your terminal:</p>
      <div className="code-block" style={{ background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" }}>
        <div className="code-header" style={{ padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" }}>Terminal</div>
        <pre style={{ padding: "1em", margin: 0, overflowX: "auto" }}><code style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 }}>bun i @denshya/proton @denshya/reactive</code></pre>
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" }}>Setup</h2>
      <p style={{ margin: "0 0 0.75em", color: "#333" }}>Configure your <code style={{ background: "#f6f8fa", padding: "0.125em 0.375em", borderRadius: "0.25em", fontSize: "0.85em" }}>tsconfig.json</code> to use Tama as the JSX runtime:</p>
      <div className="code-block" style={{ background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" }}>
        <div className="code-header" style={{ padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" }}>tsconfig.json</div>
        <pre style={{ padding: "1em", margin: 0, overflowX: "auto" }}><code style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 }}>{`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@denshya/proton/jsx/virtual"
  }
}`}</code></pre>
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" }}>Quick Start</h2>
      <p style={{ margin: "0 0 0.75em", color: "#333" }}>Here's a simple counter app to get you started:</p>
      <div className="code-block" style={{ background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" }}>
        <div className="code-header" style={{ padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" }}>App.tsx</div>
        <pre style={{ padding: "1em", margin: 0, overflowX: "auto" }}><code style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 }}>{`import { State } from "@denshya/reactive"
import { WebInflator } from "@denshya/proton"

const count = new State(0)
const inflator = new WebInflator

document.body.appendChild(
  inflator.inflate(
    <button onclick={() => count.set(count.get() + 1)}>
      Count: {count}
    </button>
  )
)`}</code></pre>
      </div>
      <blockquote className="admonition tip" style={{ margin: "1em 0", padding: "0.75em 1em", borderLeft: "4px solid #2b82d9", background: "#f0f7ff", borderRadius: "0.375em" }}>
        <strong style={{ color: "#171717" }}>TIP:</strong> Tama directly renders to real DOM elements — no virtual DOM overhead. Each reactive binding updates only the specific DOM nodes that changed.
      </blockquote>
      <blockquote className="admonition note" style={{ margin: "1em 0", padding: "0.75em 1em", borderLeft: "4px solid #6b7280", background: "#f9fafb", borderRadius: "0.375em" }}>
        <strong style={{ color: "#171717" }}>NOTE:</strong> Components in Tama are not functions — they are JSX trees. There are no hooks, no diffing, and no reconciliation algorithm.
      </blockquote>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" }}>React Developers: The Short Version</h2>
      <ul style={{ margin: "0 0 0.75em", paddingLeft: "1.5em", color: "#333" }}>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>No virtual DOM — direct DOM manipulation via WebInflator</li>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>Components are JSX trees, not function calls</li>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>State management via <code style={{ background: "#f6f8fa", padding: "0.125em 0.375em", borderRadius: "0.25em", fontSize: "0.85em" }}>@denshya/reactive</code></li>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>Fine-grained reactivity — only changed nodes update</li>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>No hooks — just state bindings and JSX</li>
        <li style={{ marginBottom: "0.375em" }}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: "0.375em" }}><path d="M6 4l4 4-4 4" /></svg>Built for performance from the ground up</li>
      </ul>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" }}>Next Steps</h2>
      <p style={{ margin: "0 0 0.75em", color: "#333" }}>Continue reading to learn more about:</p>
      <ul style={{ margin: "0 0 0.75em", paddingLeft: "1.5em", color: "#333" }}>
        <li style={{ marginBottom: "0.375em" }}><a href="/guide/reactivity" style={{ color: "#2b82d9", textDecoration: "none" }}>Reactivity</a> — Understanding fine-grained state management</li>
        <li style={{ marginBottom: "0.375em" }}><a href="/guide/components" style={{ color: "#2b82d9", textDecoration: "none" }}>Components</a> — Building reusable JSX trees</li>
        <li style={{ marginBottom: "0.375em" }}><a href="/guide/inflation" style={{ color: "#2b82d9", textDecoration: "none" }}>Inflation</a> — How JSX becomes DOM</li>
        <li style={{ marginBottom: "0.375em" }}><a href="/examples" style={{ color: "#2b82d9", textDecoration: "none" }}>Examples</a> — Real-world usage patterns</li>
      </ul>
    </div>
  )
}

function Footer_() {
  return (
    <footer style={{ borderTop: "1px solid #e1e4e8", marginTop: "3em", background: "#f6f8fa" }}>
      <div className="footer-top" style={{ maxWidth: "1300px", margin: "0 auto", padding: "1.5em 1em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <svg viewBox="0 0 25 25" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontWeight: 600 }}>Tama</span>
        </div>
        <div className="footer-links" style={{ display: "flex", gap: "1.5em" }}>
          <a href="/blog" style={{ color: "#666", textDecoration: "none", fontSize: "0.875rem" }}>Blog</a>
          <a href="/schedule" style={{ color: "#666", textDecoration: "none", fontSize: "0.875rem" }}>Schedule</a>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: "1300px", margin: "0 auto", padding: "1em", borderTop: "1px solid #e1e4e8", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#666" }}>
        <span>&copy; 2025 Denshya. All rights reserved.</span>
        <div className="footer-legal" style={{ display: "flex", gap: "1em" }}>
          <a href="/privacy" style={{ color: "#666", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ color: "#666", textDecoration: "none" }}>Terms</a>
          <a href="/cookies" style={{ color: "#666", textDecoration: "none" }}>Cookies</a>
        </div>
      </div>
    </footer>
  )
}

export function createTamaJSXFull() {
  const activeRoute = new State("learn")
  const expandedFolders = new State(new Set(["getting-started"]))
  const breadcrumbPath = new State("learn/getting-started")
  const sidebarMounted = new State(true)

  return (
    <div id="app-root">
      <Topbar />
      <main style={{ display: "flex", gap: "2.5em", maxWidth: "1300px", margin: "0 auto", padding: "1em" }}>
        <aside style={{ minWidth: "15em", position: "sticky", top: "4em", alignSelf: "flex-start", maxHeight: "calc(100vh - 5em)", overflowY: "auto" }} mounted={sidebarMounted}>
          <Sidebar activeRoute={activeRoute} expandedFolders={expandedFolders} />
        </aside>
        <article style={{ flex: 1, minWidth: 0 }}>
          <Breadcrumbs_ breadcrumbPath={breadcrumbPath} />
          <PageContent />
        </article>
      </main>
      <Footer_ />
    </div>
  )
}

export const learnPageHTML = /* @__PURE__ */ new WebJSXSerializer().toString(createTamaJSX())
