import { render, Component } from "inferno"
import { h } from "inferno-hyperscript"

// ── Function Components ─────────────────────────────────────

function Navbar() {
  return h("nav", { style: "display: flex; gap: 1.5em; align-items: center;" }, [
    h("a", { href: "/", style: "font-weight: 700; font-size: 1.125rem; text-decoration: none; color: inherit;" }, "Inferno"),
    h("a", { href: "/", style: "text-decoration: none; color: #525252; font-size: 0.875rem;" }, "Home"),
    h("a", { href: "/docs", style: "text-decoration: none; color: #525252; font-size: 0.875rem;" }, "Docs"),
    h("a", { href: "/blog", style: "text-decoration: none; color: #525252; font-size: 0.875rem;" }, "Blog"),
    h("a", { href: "/about", style: "text-decoration: none; color: #525252; font-size: 0.875rem;" }, "About"),
  ])
}

function Header() {
  return h("header", { style: "padding: 0.75em 1.5em; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center;" }, [
    h(Navbar, null),
    h("button", { style: "padding: 0.375em 1em; border: 1px solid #d4d4d4; border-radius: 0.375em; background: #fff; cursor: pointer; font-size: 0.875rem;" }, "Sign In"),
  ])
}

function StatCard({ label, value }) {
  return h("div", { style: "padding: 1.25em; border: 1px solid #e5e5e5; border-radius: 0.5em; text-align: center;" }, [
    h("div", { style: "font-size: 1.75rem; font-weight: 700; color: #171717;" }, value),
    h("div", { style: "font-size: 0.875rem; color: #737373; margin-top: 0.25em;" }, label),
  ])
}

function StatsGrid() {
  return h("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 1em; padding: 1.5em;" }, [
    h(StatCard, { label: "Users", value: "12K+" }),
    h(StatCard, { label: "Downloads", value: "50K+" }),
    h(StatCard, { label: "Stars", value: "3.2K" }),
    h(StatCard, { label: "Contributors", value: "84" }),
  ])
}

function FeatureCard({ icon, title, description }) {
  return h("div", { style: "padding: 1.5em; border: 1px solid #e5e5e5; border-radius: 0.5em;" }, [
    h("div", { style: "font-size: 1.5rem; margin-bottom: 0.5em;" }, icon),
    h("h3", { style: "margin: 0 0 0.375em; font-size: 1rem; font-weight: 600;" }, title),
    h("p", { style: "margin: 0; font-size: 0.875rem; color: #525252; line-height: 1.5;" }, description),
  ])
}

function FeaturesSection() {
  return h("div", { style: "padding: 1.5em;" }, [
    h("h2", { style: "margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;" }, "Features"),
    h("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 1em;" }, [
      h(FeatureCard, { icon: "⚡", title: "Fast", description: "Optimized for performance with minimal overhead." }),
      h(FeatureCard, { icon: "🔒", title: "Secure", description: "Built with security best practices in mind." }),
      h(FeatureCard, { icon: "🎨", title: "Flexible", description: "Customizable to fit your needs and preferences." }),
      h(FeatureCard, { icon: "📦", title: "Modular", description: "Tree-shakeable modules for optimal bundles." }),
      h(FeatureCard, { icon: "🛠️", title: "Tooling", description: "Great DX with TypeScript and IDE support." }),
      h(FeatureCard, { icon: "🌐", title: "Universal", description: "Works across browsers and platforms." }),
    ]),
  ])
}

// ── Class Components ────────────────────────────────────────

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  render() {
    return h("div", { style: "display: flex; align-items: center; gap: 0.75em; padding: 1em; border: 1px solid #e5e5e5; border-radius: 0.5em;" }, [
      h("span", { style: "font-weight: 500; min-width: 5em;" }, "Counter"),
      h("button", { onClick: () => this.setState({ count: this.state.count - 1 }), style: "padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;" }, "−"),
      h("span", { style: "min-width: 2em; text-align: center; font-variant-numeric: tabular-nums; font-weight: 600;" }, String(this.state.count)),
      h("button", { onClick: () => this.setState({ count: this.state.count + 1 }), style: "padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;" }, "+"),
      h("button", { onClick: () => this.setState({ count: 0 }), style: "padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;" }, "Reset"),
    ])
  }
}

function CounterSection() {
  return h("div", { style: "padding: 1.5em;" }, [
    h("h2", { style: "margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;" }, "Interactive Counters"),
    h("div", { style: "display: flex; flex-direction: column; gap: 0.75em;" }, [
      h(Counter, null),
      h(Counter, null),
      h(Counter, null),
    ]),
  ])
}

class ToggleSwitch extends Component {
  constructor(props) {
    super(props)
    this.state = { on: props.initialState ?? false }
    this.toggle = () => this.setState({ on: !this.state.on })
  }
  render() {
    return h("div", { style: "display: flex; align-items: center; gap: 0.75em; padding: 0.75em 1em; border: 1px solid #e5e5e5; border-radius: 0.5em;" }, [
      h("span", { style: "flex: 1; font-size: 0.875rem;" }, this.props.label),
      h("button", { onClick: this.toggle, style: "padding: 0.25em 1em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; font-size: 0.75rem; font-weight: 600; background: #fafafa;" }, this.state.on ? "ON" : "OFF"),
    ])
  }
}

function TogglesSection() {
  return h("div", { style: "padding: 1.5em;" }, [
    h("h2", { style: "margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;" }, "Settings"),
    h("div", { style: "display: flex; flex-direction: column; gap: 0.5em;" }, [
      h(ToggleSwitch, { label: "Notifications", initialState: true }),
      h(ToggleSwitch, { label: "Dark Mode" }),
      h(ToggleSwitch, { label: "Auto-save", initialState: true }),
      h(ToggleSwitch, { label: "Sound Effects", initialState: true }),
      h(ToggleSwitch, { label: "Analytics" }),
    ]),
  ])
}

class AccordionItem extends Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.toggle = () => this.setState({ open: !this.state.open })
  }
  render() {
    return h("div", { style: "border: 1px solid #e5e5e5; border-radius: 0.5em; overflow: hidden;" }, [
      h("button", { onClick: this.toggle, style: "width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0.75em 1em; border: none; background: #fafafa; cursor: pointer; font-size: 0.875rem; font-weight: 500; text-align: left;" }, [
        h("span", null, this.props.title),
        h("span", { style: "transition: transform 0.2s;" }, this.state.open ? "▾" : "▸"),
      ]),
      this.state.open ? h("div", { style: "padding: 0.75em 1em; font-size: 0.8125rem; color: #525252; line-height: 1.6; border-top: 1px solid #e5e5e5;" }, this.props.children) : null,
    ])
  }
}

function FAQSection() {
  return h("div", { style: "padding: 1.5em;" }, [
    h("h2", { style: "margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;" }, "FAQ"),
    h("div", { style: "display: flex; flex-direction: column; gap: 0.5em;" }, [
      h(AccordionItem, { title: "What is Inferno?" }, "Inferno is an extremely fast, React-like library for building high-performance user interfaces on both the client and server. It uses a virtual DOM with intelligent diffing algorithms to minimize DOM operations."),
      h(AccordionItem, { title: "How does it compare to React?" }, "Inferno is significantly smaller (8KB gzipped) and faster than React while maintaining a similar API. It uses a different VNode creation strategy and optimizes for minimal memory allocations during reconciliation."),
      h(AccordionItem, { title: "Is it production ready?" }, "Yes, Inferno is production ready and powers several high-traffic websites. It has a stable API and an active community focused on performance and reliability."),
      h(AccordionItem, { title: "How do I get started?" }, "Install via npm with 'npm i inferno', configure your build tool to use Inferno's JSX pragma, and start building components with the familiar React-like API but with better performance."),
    ]),
  ])
}

function Footer() {
  return h("footer", { style: "border-top: 1px solid #e5e5e5; padding: 1.5em; margin-top: 1em;" }, [
    h("div", { style: "display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;" }, [
      h("div", { style: "font-size: 0.8125rem; color: #737373;" }, "© 2025 Inferno. All rights reserved."),
      h("div", { style: "display: flex; gap: 1.5em;" }, [
        h("a", { href: "/privacy", style: "font-size: 0.8125rem; color: #737373; text-decoration: none;" }, "Privacy"),
        h("a", { href: "/terms", style: "font-size: 0.8125rem; color: #737373; text-decoration: none;" }, "Terms"),
        h("a", { href: "/contact", style: "font-size: 0.8125rem; color: #737373; text-decoration: none;" }, "Contact"),
      ]),
    ]),
  ])
}

function App() {
  return h("div", { id: "app-root", style: "font-family: system-ui, -apple-system, sans-serif; color: #171717;" }, [
    h(Header, null),
    h("main", { style: "max-width: 960px; margin: 0 auto;" }, [
      h("div", { style: "padding: 2em 1.5em; text-align: center;" }, [
        h("h1", { style: "font-size: 2rem; font-weight: 700; margin: 0 0 0.5em;" }, "Build Faster with Inferno"),
        h("p", { style: "font-size: 1.125rem; color: #525252; margin: 0 0 1.5em; line-height: 1.6;" }, "An extremely fast, React-like library for building high-performance user interfaces on both the client and server."),
        h("div", { style: "display: flex; gap: 0.75em; justify-content: center;" }, [
          h("button", { style: "padding: 0.625em 1.5em; border: none; border-radius: 0.375em; background: #171717; color: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 500;" }, "Get Started"),
          h("button", { style: "padding: 0.625em 1.5em; border: 1px solid #d4d4d4; border-radius: 0.375em; background: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 500;" }, "Learn More"),
        ]),
      ]),
      h(StatsGrid, null),
      h(FeaturesSection, null),
      h(CounterSection, null),
      h(TogglesSection, null),
      h(FAQSection, null),
    ]),
    h(Footer, null),
  ])
}

// ── Bootstrap ─────────────────────────────────────────────

const root = document.createElement("div")
document.body.appendChild(root)
render(h(App, null), root)
console.log("Inferno rendered")
