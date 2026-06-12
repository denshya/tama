import { h } from "inferno-hyperscript"

export function createLearnPageInferno() {
  return h("div", { id: "app-root" }, [
    h("header", { id: "topbar", style: "position: sticky; top: 0; z-index: 100;" }, [
      h("div", { className: "container", style: "max-width: 1300px; margin: 0 auto; display: flex; align-items: center; padding: 0.5em 1em;" }, [
        h("a", { href: "/", className: "logo", style: "display: flex; align-items: center; gap: 0.5em; text-decoration: none; color: inherit;" }, [
          h("svg", { viewBox: "0 0 25 25", width: "24", height: "24", fill: "none", stroke: "currentColor", "stroke-width": "2" }, [
            h("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }),
          ]),
          h("span", { style: "font-weight: 700; font-size: 1.125rem;" }, "Tama"),
        ]),
        h("nav", { className: "navbar", style: "flex: 1; display: flex; justify-content: center;" }),
        h("div", { className: "secondary-links", style: "display: flex; gap: 0.75em; align-items: center;" }, [
          h("a", { href: "https://github.com", "aria-label": "GitHub", style: "color: #666;" }, [
            h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
              h("path", { d: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" }),
            ]),
          ]),
          h("a", { href: "https://discord.com", "aria-label": "Discord", style: "color: #666;" }, [
            h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
              h("path", { d: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" }),
            ]),
          ]),
          h("a", { href: "https://bsky.app", "aria-label": "Bluesky", style: "color: #666;" }, [
            h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
              h("path", { d: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.023 0 1.62 0 4.2c0 .84.48 7.08.756 8.1.972 3.468 4.512 4.344 7.656 3.792-5.352 1.152-6.72 4.296-3.864 6.096 5.712 3.6 7.452-2.076 7.452-6.396V4.956c0-.42-.336-.756-.756-.756-2.52 0-5.412 4.776-6.588 6.636z" }),
            ]),
          ]),
        ]),
      ]),
    ]),
    h("main", { style: "display: flex; gap: 2.5em; max-width: 1300px; margin: 0 auto; padding: 1em;" }, [
      h("aside", { style: "min-width: 15em; position: sticky; top: 4em; align-self: flex-start; max-height: calc(100vh - 5em); overflow-y: auto;" }, [
        h("nav", { className: "sidebar" }, [
          h("ul", { style: "list-style: none; padding: 0; margin: 0;" }, [
            h("li", { style: "margin-bottom: 0.25em;" }, [
              h("span", { style: "display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; cursor: pointer; font-weight: 600; font-size: 0.875rem; color: #171717;" }, [
                h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "transition: transform 0.2s;" }, [
                  h("path", { d: "M6 4l4 4-4 4" }),
                ]),
                " Getting Started",
              ]),
              h("ul", { style: "list-style: none; padding: 0; margin: 0 0 0 1.25em;" }, [
                h("li", null, h("a", { href: "/learn", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none; background: rgba(0,0,0,0.05);" }, "Learn")),
                h("li", null, h("a", { href: "/installation", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "Installation")),
                h("li", null, h("a", { href: "/quick-start", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "Quick Start")),
              ]),
            ]),
            h("li", { style: "margin-bottom: 0.25em;" }, [
              h("a", { href: "/guide", style: "display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none;" }, "Guide"),
            ]),
            h("li", { style: "margin-bottom: 0.25em;" }, [
              h("span", { style: "display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; cursor: pointer; font-weight: 600; font-size: 0.875rem; color: #171717;" }, [
                h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "transition: transform 0.2s;" }, [
                  h("path", { d: "M6 4l4 4-4 4" }),
                ]),
                " API Reference",
              ]),
              h("ul", { style: "list-style: none; padding: 0; margin: 0 0 0 1.25em;" }, [
                h("li", null, h("a", { href: "/api/state", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "State")),
                h("li", null, h("a", { href: "/api/component", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "Component")),
                h("li", null, h("a", { href: "/api/inflator", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "Inflator")),
                h("li", null, h("a", { href: "/api/jsx", style: "display: block; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "JSX")),
              ]),
            ]),
            h("li", { style: "margin-bottom: 0.25em;" }, [
              h("a", { href: "/examples", style: "display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #171717; text-decoration: none;" }, "Examples"),
            ]),
            h("li", { style: "margin-bottom: 0.25em;" }, [
              h("a", { href: "/blog", style: "display: flex; align-items: center; gap: 0.25em; padding: 0.375em 0.5em; border-radius: 0.375em; font-size: 0.875rem; color: #666; text-decoration: none;" }, "Blog"),
            ]),
          ]),
        ]),
      ]),
      h("article", { style: "flex: 1; min-width: 0;" }, [
        h("nav", { className: "breadcrumbs", style: "margin-bottom: 1em; font-size: 0.875rem; color: #666;" }, [
          h("ol", { style: "list-style: none; padding: 0; margin: 0; display: flex; align-items: center; gap: 0.5em;" }, [
            h("li", { style: "display: flex; align-items: center; gap: 0.5em;" }, [
              h("a", { href: "/", style: "color: #666; text-decoration: none;" }, "Home"),
              h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor" }, [
                h("path", { d: "M6 4l4 4-4 4" }),
              ]),
            ]),
            h("li", { style: "display: flex; align-items: center; gap: 0.5em;" }, [
              h("a", { href: "/learn", style: "color: #666; text-decoration: none;" }, "Learn"),
              h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor" }, [
                h("path", { d: "M6 4l4 4-4 4" }),
              ]),
            ]),
            h("li", { style: "display: flex; align-items: center; gap: 0.5em;" }, [
              h("span", { style: "color: #171717; background: rgba(0,0,0,0.05); padding: 0.125em 0.375em; border-radius: 0.25em;" }, "Getting Started"),
            ]),
          ]),
        ]),
        h("div", { className: "md-content", style: "line-height: 1.5;" }, [
          h("h1", { style: "font-size: 2.25rem; font-weight: 700; margin: 0 0 0.5em; color: #171717;" }, "Getting Started"),
          h("p", { style: "margin: 0 0 0.75em; color: #333;" }, "Welcome to Tama! This guide will help you get started building applications with fine-grained reactivity and direct DOM rendering."),
          h("h2", { style: "font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;" }, "Install"),
          h("p", { style: "margin: 0 0 0.75em; color: #333;" }, "Run the following command in your terminal:"),
          h("div", { className: "code-block", style: "background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;" }, [
            h("div", { className: "code-header", style: "padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;" }, "Terminal"),
            h("pre", { style: "padding: 1em; margin: 0; overflow-x: auto;" }, [
              h("code", { style: "font-family: monospace; font-size: 0.875rem; line-height: 1.4;" }, "bun i @denshya/proton @denshya/reactive"),
            ]),
          ]),
          h("h2", { style: "font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;" }, "Setup"),
          h("p", { style: "margin: 0 0 0.75em; color: #333;" }, "Configure your ", h("code", { style: "background: #f6f8fa; padding: 0.125em 0.375em; border-radius: 0.25em; font-size: 0.85em;" }, "tsconfig.json"), " to use Tama as the JSX runtime:"),
          h("div", { className: "code-block", style: "background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;" }, [
            h("div", { className: "code-header", style: "padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;" }, "tsconfig.json"),
            h("pre", { style: "padding: 1em; margin: 0; overflow-x: auto;" }, [
              h("code", { style: "font-family: monospace; font-size: 0.875rem; line-height: 1.4;" }, `{\n  "compilerOptions": {\n    "jsx": "react-jsx",\n    "jsxImportSource": "@denshya/proton/jsx/virtual"\n  }\n}`),
            ]),
          ]),
          h("h2", { style: "font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;" }, "Quick Start"),
          h("p", { style: "margin: 0 0 0.75em; color: #333;" }, "Here's a simple counter app to get you started:"),
          h("div", { className: "code-block", style: "background: #f6f8fa; border-radius: 0.5em; overflow: hidden; margin-bottom: 1em;" }, [
            h("div", { className: "code-header", style: "padding: 0.5em 1em; font-size: 0.8rem; color: #666; border-bottom: 1px solid #e1e4e8; font-family: monospace;" }, "App.tsx"),
            h("pre", { style: "padding: 1em; margin: 0; overflow-x: auto;" }, [
              h("code", { style: "font-family: monospace; font-size: 0.875rem; line-height: 1.4;" }, `import { State } from "@denshya/reactive"\nimport { WebInflator } from "@denshya/proton"\n\nconst count = new State(0)\nconst inflator = new WebInflator\n\ndocument.body.appendChild(\n  inflator.inflate(\n    <button onclick={() => count.set(count.get() + 1)}>\n      Count: {count}\n    </button>\n  )\n)`),
            ]),
          ]),
          h("blockquote", { className: "admonition tip", style: "margin: 1em 0; padding: 0.75em 1em; border-left: 4px solid #2b82d9; background: #f0f7ff; border-radius: 0.375em;" }, [
            h("strong", { style: "color: #171717;" }, "TIP:"),
            " Tama directly renders to real DOM elements — no virtual DOM overhead. Each reactive binding updates only the specific DOM nodes that changed.",
          ]),
          h("blockquote", { className: "admonition note", style: "margin: 1em 0; padding: 0.75em 1em; border-left: 4px solid #6b7280; background: #f9fafb; border-radius: 0.375em;" }, [
            h("strong", { style: "color: #171717;" }, "NOTE:"),
            " Components in Tama are not functions — they are JSX trees. There are no hooks, no diffing, and no reconciliation algorithm.",
          ]),
          h("h2", { style: "font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;" }, "React Developers: The Short Version"),
          h("ul", { style: "margin: 0 0 0.75em; padding-left: 1.5em; color: #333;" }, [
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "No virtual DOM — direct DOM manipulation via WebInflator"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "Components are JSX trees, not function calls"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "State management via ", h("code", { style: "background: #f6f8fa; padding: 0.125em 0.375em; border-radius: 0.25em; font-size: 0.85em;" }, "@denshya/reactive")]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "Fine-grained reactivity — only changed nodes update"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "No hooks — just state bindings and JSX"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: "margin-right: 0.375em;" }, [h("path", { d: "M6 4l4 4-4 4" })]), "Built for performance from the ground up"]),
          ]),
          h("h2", { style: "font-size: 1.5rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #171717;" }, "Next Steps"),
          h("p", { style: "margin: 0 0 0.75em; color: #333;" }, "Continue reading to learn more about:"),
          h("ul", { style: "margin: 0 0 0.75em; padding-left: 1.5em; color: #333;" }, [
            h("li", { style: "margin-bottom: 0.375em;" }, [h("a", { href: "/guide/reactivity", style: "color: #2b82d9; text-decoration: none;" }, "Reactivity"), " — Understanding fine-grained state management"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("a", { href: "/guide/components", style: "color: #2b82d9; text-decoration: none;" }, "Components"), " — Building reusable JSX trees"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("a", { href: "/guide/inflation", style: "color: #2b82d9; text-decoration: none;" }, "Inflation"), " — How JSX becomes DOM"]),
            h("li", { style: "margin-bottom: 0.375em;" }, [h("a", { href: "/examples", style: "color: #2b82d9; text-decoration: none;" }, "Examples"), " — Real-world usage patterns"]),
          ]),
        ]),
      ]),
    ]),
    h("footer", { style: "border-top: 1px solid #e1e4e8; margin-top: 3em; background: #f6f8fa;" }, [
      h("div", { className: "footer-top", style: "max-width: 1300px; margin: 0 auto; padding: 1.5em 1em; display: flex; justify-content: space-between; align-items: center;" }, [
        h("div", { className: "footer-logo", style: "display: flex; align-items: center; gap: 0.5em;" }, [
          h("svg", { viewBox: "0 0 25 25", width: "20", height: "20", fill: "none", stroke: "currentColor", "stroke-width": "2" }, [
            h("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }),
          ]),
          h("span", { style: "font-weight: 600;" }, "Tama"),
        ]),
        h("div", { className: "footer-links", style: "display: flex; gap: 1.5em;" }, [
          h("a", { href: "/blog", style: "color: #666; text-decoration: none; font-size: 0.875rem;" }, "Blog"),
          h("a", { href: "/schedule", style: "color: #666; text-decoration: none; font-size: 0.875rem;" }, "Schedule"),
        ]),
      ]),
      h("div", { className: "footer-bottom", style: "max-width: 1300px; margin: 0 auto; padding: 1em; border-top: 1px solid #e1e4e8; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #666;" }, [
        h("span", null, "\u00a9 2025 Denshya. All rights reserved."),
        h("div", { className: "footer-legal", style: "display: flex; gap: 1em;" }, [
          h("a", { href: "/privacy", style: "color: #666; text-decoration: none;" }, "Privacy"),
          h("a", { href: "/terms", style: "color: #666; text-decoration: none;" }, "Terms"),
          h("a", { href: "/cookies", style: "color: #666; text-decoration: none;" }, "Cookies"),
        ]),
      ]),
    ]),
  ])
}

// ─── Full Inferno tree with components and style objects ─────────

function ITopbar() {
  return h("header", { id: "topbar", style: { position: "sticky", top: 0, zIndex: 100 } }, [
    h("div", { className: "container", style: { maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", padding: "0.5em 1em" } }, [
      h("a", { href: "/", className: "logo", style: { display: "flex", alignItems: "center", gap: "0.5em", textDecoration: "none", color: "inherit" } }, [
        h("svg", { viewBox: "0 0 25 25", width: "24", height: "24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, [
          h("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }),
        ]),
        h("span", { style: { fontWeight: 700, fontSize: "1.125rem" } }, "Tama"),
      ]),
      h("nav", { className: "navbar", style: { flex: 1, display: "flex", justifyContent: "center" } }),
      h("div", { className: "secondary-links", style: { display: "flex", gap: "0.75em", alignItems: "center" } }, [
        h("a", { href: "https://github.com", "aria-label": "GitHub", style: { color: "#666" } }, [
          h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
            h("path", { d: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" }),
          ]),
        ]),
        h("a", { href: "https://discord.com", "aria-label": "Discord", style: { color: "#666" } }, [
          h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
            h("path", { d: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" }),
          ]),
        ]),
        h("a", { href: "https://bsky.app", "aria-label": "Bluesky", style: { color: "#666" } }, [
          h("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor" }, [
            h("path", { d: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.023 0 1.62 0 4.2c0 .84.48 7.08.756 8.1.972 3.468 4.512 4.344 7.656 3.792-5.352 1.152-6.72 4.296-3.864 6.096 5.712 3.6 7.452-2.076 7.452-6.396V4.956c0-.42-.336-.756-.756-.756-2.52 0-5.412 4.776-6.588 6.636z" }),
          ]),
        ]),
      ]),
    ]),
  ])
}

function ISidebar() {
  const expanded = new Set(["getting-started"])
  const toggleGS = () => {
    expanded.has("getting-started") ? expanded.delete("getting-started") : expanded.add("getting-started")
  }
  const toggleApi = () => {
    expanded.has("api") ? expanded.delete("api") : expanded.add("api")
  }

  return h("nav", { className: "sidebar" }, [
    h("ul", { style: { listStyle: "none", padding: 0, margin: 0 } }, [
      h("li", { style: { marginBottom: "0.25em" } }, [
        h("span", { onClick: toggleGS, style: { display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "#171717" } }, [
          h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { transition: "transform 0.2s" } }, [
            h("path", { d: "M6 4l4 4-4 4" }),
          ]),
          " Getting Started",
        ]),
        h("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 0 1.25em" } }, [
          h("li", null, h("a", { href: "/learn", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none", background: "rgba(0,0,0,0.05)" } }, "Learn")),
          h("li", null, h("a", { href: "/installation", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "Installation")),
          h("li", null, h("a", { href: "/quick-start", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "Quick Start")),
        ]),
      ]),
      h("li", { style: { marginBottom: "0.25em" } }, [
        h("a", { href: "/guide", style: { display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none" } }, "Guide"),
      ]),
      h("li", { style: { marginBottom: "0.25em" } }, [
        h("span", { onClick: toggleApi, style: { display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "#171717" } }, [
          h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { transition: "transform 0.2s" } }, [
            h("path", { d: "M6 4l4 4-4 4" }),
          ]),
          " API Reference",
        ]),
        h("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 0 1.25em" } }, [
          h("li", null, h("a", { href: "/api/state", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "State")),
          h("li", null, h("a", { href: "/api/component", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "Component")),
          h("li", null, h("a", { href: "/api/inflator", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "Inflator")),
          h("li", null, h("a", { href: "/api/jsx", style: { display: "block", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "JSX")),
        ]),
      ]),
      h("li", { style: { marginBottom: "0.25em" } }, [
        h("a", { href: "/examples", style: { display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#171717", textDecoration: "none" } }, "Examples"),
      ]),
      h("li", { style: { marginBottom: "0.25em" } }, [
        h("a", { href: "/blog", style: { display: "flex", alignItems: "center", gap: "0.25em", padding: "0.375em 0.5em", borderRadius: "0.375em", fontSize: "0.875rem", color: "#666", textDecoration: "none" } }, "Blog"),
      ]),
    ]),
  ])
}

function IBreadcrumbs() {
  return h("nav", { className: "breadcrumbs", style: { marginBottom: "1em", fontSize: "0.875rem", color: "#666" } }, [
    h("ol", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", alignItems: "center", gap: "0.5em" } }, [
      h("li", { style: { display: "flex", alignItems: "center", gap: "0.5em" } }, [
        h("a", { href: "/", style: { color: "#666", textDecoration: "none" } }, "Home"),
        h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor" }, [h("path", { d: "M6 4l4 4-4 4" })]),
      ]),
      h("li", { style: { display: "flex", alignItems: "center", gap: "0.5em" } }, [
        h("a", { href: "/learn", style: { color: "#666", textDecoration: "none" } }, "Learn"),
        h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor" }, [h("path", { d: "M6 4l4 4-4 4" })]),
      ]),
      h("li", { style: { display: "flex", alignItems: "center", gap: "0.5em" } }, [
        h("span", { style: { color: "#171717", background: "rgba(0,0,0,0.05)", padding: "0.125em 0.375em", borderRadius: "0.25em" } }, "Getting Started"),
      ]),
    ]),
  ])
}

function IPageContent() {
  return h("div", { className: "md-content", style: { lineHeight: 1.5 } }, [
    h("h1", { style: { fontSize: "2.25rem", fontWeight: 700, margin: "0 0 0.5em", color: "#171717" } }, "Getting Started"),
    h("p", { style: { margin: "0 0 0.75em", color: "#333" } }, "Welcome to Tama! This guide will help you get started building applications with fine-grained reactivity and direct DOM rendering."),
    h("h2", { style: { fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" } }, "Install"),
    h("p", { style: { margin: "0 0 0.75em", color: "#333" } }, "Run the following command in your terminal:"),
    h("div", { className: "code-block", style: { background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" } }, [
      h("div", { className: "code-header", style: { padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" } }, "Terminal"),
      h("pre", { style: { padding: "1em", margin: 0, overflowX: "auto" } }, [
        h("code", { style: { fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 } }, "bun i @denshya/proton @denshya/reactive"),
      ]),
    ]),
    h("h2", { style: { fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" } }, "Setup"),
    h("p", { style: { margin: "0 0 0.75em", color: "#333" } }, "Configure your ", h("code", { style: { background: "#f6f8fa", padding: "0.125em 0.375em", borderRadius: "0.25em", fontSize: "0.85em" } }, "tsconfig.json"), " to use Tama as the JSX runtime:"),
    h("div", { className: "code-block", style: { background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" } }, [
      h("div", { className: "code-header", style: { padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" } }, "tsconfig.json"),
      h("pre", { style: { padding: "1em", margin: 0, overflowX: "auto" } }, [
        h("code", { style: { fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 } }, `{\n  "compilerOptions": {\n    "jsx": "react-jsx",\n    "jsxImportSource": "@denshya/proton/jsx/virtual"\n  }\n}`),
      ]),
    ]),
    h("h2", { style: { fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" } }, "Quick Start"),
    h("p", { style: { margin: "0 0 0.75em", color: "#333" } }, "Here's a simple counter app to get you started:"),
    h("div", { className: "code-block", style: { background: "#f6f8fa", borderRadius: "0.5em", overflow: "hidden", marginBottom: "1em" } }, [
      h("div", { className: "code-header", style: { padding: "0.5em 1em", fontSize: "0.8rem", color: "#666", borderBottom: "1px solid #e1e4e8", fontFamily: "monospace" } }, "App.tsx"),
      h("pre", { style: { padding: "1em", margin: 0, overflowX: "auto" } }, [
        h("code", { style: { fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.4 } }, `import { State } from "@denshya/reactive"\nimport { WebInflator } from "@denshya/proton"\n\nconst count = new State(0)\nconst inflator = new WebInflator\n\ndocument.body.appendChild(\n  inflator.inflate(\n    <button onclick={() => count.set(count.get() + 1)}>\n      Count: {count}\n    </button>\n  )\n)`),
      ]),
    ]),
    h("blockquote", { className: "admonition tip", style: { margin: "1em 0", padding: "0.75em 1em", borderLeft: "4px solid #2b82d9", background: "#f0f7ff", borderRadius: "0.375em" } }, [
      h("strong", { style: { color: "#171717" } }, "TIP:"),
      " Tama directly renders to real DOM elements — no virtual DOM overhead. Each reactive binding updates only the specific DOM nodes that changed.",
    ]),
    h("blockquote", { className: "admonition note", style: { margin: "1em 0", padding: "0.75em 1em", borderLeft: "4px solid #6b7280", background: "#f9fafb", borderRadius: "0.375em" } }, [
      h("strong", { style: { color: "#171717" } }, "NOTE:"),
      " Components in Tama are not functions — they are JSX trees. There are no hooks, no diffing, and no reconciliation algorithm.",
    ]),
    h("h2", { style: { fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" } }, "React Developers: The Short Version"),
    h("ul", { style: { margin: "0 0 0.75em", paddingLeft: "1.5em", color: "#333" } }, [
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "No virtual DOM — direct DOM manipulation via WebInflator"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "Components are JSX trees, not function calls"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "State management via ", h("code", { style: { background: "#f6f8fa", padding: "0.125em 0.375em", borderRadius: "0.25em", fontSize: "0.85em" } }, "@denshya/reactive")]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "Fine-grained reactivity — only changed nodes update"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "No hooks — just state bindings and JSX"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("svg", { viewBox: "0 0 16 16", width: "12", height: "12", fill: "currentColor", style: { marginRight: "0.375em" } }, [h("path", { d: "M6 4l4 4-4 4" })]), "Built for performance from the ground up"]),
    ]),
    h("h2", { style: { fontSize: "1.5rem", fontWeight: 600, margin: "1.5em 0 0.5em", color: "#171717" } }, "Next Steps"),
    h("p", { style: { margin: "0 0 0.75em", color: "#333" } }, "Continue reading to learn more about:"),
    h("ul", { style: { margin: "0 0 0.75em", paddingLeft: "1.5em", color: "#333" } }, [
      h("li", { style: { marginBottom: "0.375em" } }, [h("a", { href: "/guide/reactivity", style: { color: "#2b82d9", textDecoration: "none" } }, "Reactivity"), " — Understanding fine-grained state management"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("a", { href: "/guide/components", style: { color: "#2b82d9", textDecoration: "none" } }, "Components"), " — Building reusable JSX trees"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("a", { href: "/guide/inflation", style: { color: "#2b82d9", textDecoration: "none" } }, "Inflation"), " — How JSX becomes DOM"]),
      h("li", { style: { marginBottom: "0.375em" } }, [h("a", { href: "/examples", style: { color: "#2b82d9", textDecoration: "none" } }, "Examples"), " — Real-world usage patterns"]),
    ]),
  ])
}

function IFooter() {
  return h("footer", { style: { borderTop: "1px solid #e1e4e8", marginTop: "3em", background: "#f6f8fa" } }, [
    h("div", { className: "footer-top", style: { maxWidth: "1300px", margin: "0 auto", padding: "1.5em 1em", display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
      h("div", { className: "footer-logo", style: { display: "flex", alignItems: "center", gap: "0.5em" } }, [
        h("svg", { viewBox: "0 0 25 25", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2" }, [
          h("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }),
        ]),
        h("span", { style: { fontWeight: 600 } }, "Tama"),
      ]),
      h("div", { className: "footer-links", style: { display: "flex", gap: "1.5em" } }, [
        h("a", { href: "/blog", style: { color: "#666", textDecoration: "none", fontSize: "0.875rem" } }, "Blog"),
        h("a", { href: "/schedule", style: { color: "#666", textDecoration: "none", fontSize: "0.875rem" } }, "Schedule"),
      ]),
    ]),
    h("div", { className: "footer-bottom", style: { maxWidth: "1300px", margin: "0 auto", padding: "1em", borderTop: "1px solid #e1e4e8", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#666" } }, [
      h("span", null, "\u00a9 2025 Denshya. All rights reserved."),
      h("div", { className: "footer-legal", style: { display: "flex", gap: "1em" } }, [
        h("a", { href: "/privacy", style: { color: "#666", textDecoration: "none" } }, "Privacy"),
        h("a", { href: "/terms", style: { color: "#666", textDecoration: "none" } }, "Terms"),
        h("a", { href: "/cookies", style: { color: "#666", textDecoration: "none" } }, "Cookies"),
      ]),
    ]),
  ])
}

export function createLearnPageInfernoFull() {
  return h("div", { id: "app-root" }, [
    h(ITopbar, null),
    h("main", { style: { display: "flex", gap: "2.5em", maxWidth: "1300px", margin: "0 auto", padding: "1em" } }, [
      h("aside", { style: { minWidth: "15em", position: "sticky", top: "4em", alignSelf: "flex-start", maxHeight: "calc(100vh - 5em)", overflowY: "auto" } }, [
        h(ISidebar, null),
      ]),
      h("article", { style: { flex: 1, minWidth: 0 } }, [
        h(IBreadcrumbs, null),
        h(IPageContent, null),
      ]),
    ]),
    h(IFooter, null),
  ])
}
