import { State } from "@denshya/reactive"
import { WebInflator } from "../../build"

// ── Components ──────────────────────────────────────────

function Navbar() {
  return (
    <nav style="display: flex; gap: 1.5em; align-items: center;">
      <a href="/" style="font-weight: 700; font-size: 1.125rem; text-decoration: none; color: inherit;">Tama</a>
      <a href="/" style="text-decoration: none; color: #525252; font-size: 0.875rem;">Home</a>
      <a href="/docs" style="text-decoration: none; color: #525252; font-size: 0.875rem;">Docs</a>
      <a href="/blog" style="text-decoration: none; color: #525252; font-size: 0.875rem;">Blog</a>
      <a href="/about" style="text-decoration: none; color: #525252; font-size: 0.875rem;">About</a>
    </nav>
  )
}

function Header() {
  return (
    <header style="padding: 0.75em 1.5em; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center;">
      <Navbar />
      <button style="padding: 0.375em 1em; border: 1px solid #d4d4d4; border-radius: 0.375em; background: #fff; cursor: pointer; font-size: 0.875rem;">Sign In</button>
    </header>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style="padding: 1.25em; border: 1px solid #e5e5e5; border-radius: 0.5em; text-align: center;">
      <div style="font-size: 1.75rem; font-weight: 700; color: #171717;">{value}</div>
      <div style="font-size: 0.875rem; color: #737373; margin-top: 0.25em;">{label}</div>
    </div>
  )
}

function StatsGrid() {
  return (
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1em; padding: 1.5em;">
      <StatCard label="Users" value="12K+" />
      <StatCard label="Downloads" value="50K+" />
      <StatCard label="Stars" value="3.2K" />
      <StatCard label="Contributors" value="84" />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style="padding: 1.5em; border: 1px solid #e5e5e5; border-radius: 0.5em;">
      <div style="font-size: 1.5rem; margin-bottom: 0.5em;">{icon}</div>
      <h3 style="margin: 0 0 0.375em; font-size: 1rem; font-weight: 600;">{title}</h3>
      <p style="margin: 0; font-size: 0.875rem; color: #525252; line-height: 1.5;">{description}</p>
    </div>
  )
}

function FeaturesSection() {
  return (
    <div style="padding: 1.5em;">
      <h2 style="margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;">Features</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1em;">
        <FeatureCard icon="⚡" title="Fast" description="Optimized for performance with minimal overhead." />
        <FeatureCard icon="🔒" title="Secure" description="Built with security best practices in mind." />
        <FeatureCard icon="🎨" title="Flexible" description="Customizable to fit your needs and preferences." />
        <FeatureCard icon="📦" title="Modular" description="Tree-shakeable modules for optimal bundles." />
        <FeatureCard icon="🛠️" title="Tooling" description="Great DX with TypeScript and IDE support." />
        <FeatureCard icon="🌐" title="Universal" description="Works across browsers and platforms." />
      </div>
    </div>
  )
}

function Counter() {
  const count = new State(0)
  return (
    <div style="display: flex; align-items: center; gap: 0.75em; padding: 1em; border: 1px solid #e5e5e5; border-radius: 0.5em;">
      <span style="font-weight: 500; min-width: 5em;">Counter</span>
      <button onclick={() => count.set(count.get() - 1)} style="padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;">−</button>
      <span style="min-width: 2em; text-align: center; font-variant-numeric: tabular-nums; font-weight: 600;">{count}</span>
      <button onclick={() => count.set(count.get() + 1)} style="padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;">+</button>
      <button onclick={() => count.set(0)} style="padding: 0.375em 0.75em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; background: #fafafa; font-size: 0.875rem;">Reset</button>
    </div>
  )
}

function CounterSection() {
  return (
    <div style="padding: 1.5em;">
      <h2 style="margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;">Interactive Counters</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75em;">
        <Counter />
        <Counter />
        <Counter />
      </div>
    </div>
  )
}

function ToggleSwitch({ label, initialState }: { label: string; initialState?: boolean }) {
  const on = new State(initialState ?? false)
  return (
    <div style="display: flex; align-items: center; gap: 0.75em; padding: 0.75em 1em; border: 1px solid #e5e5e5; border-radius: 0.5em;">
      <span style="flex: 1; font-size: 0.875rem;">{label}</span>
      <button onclick={() => on.set(!on.get())} style="padding: 0.25em 1em; cursor: pointer; border: 1px solid #d4d4d4; border-radius: 0.25em; font-size: 0.75rem; font-weight: 600; background: #fafafa;">{() => on.get() ? "ON" : "OFF"}</button>
    </div>
  )
}

function TogglesSection() {
  return (
    <div style="padding: 1.5em;">
      <h2 style="margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;">Settings</h2>
      <div style="display: flex; flex-direction: column; gap: 0.5em;">
        <ToggleSwitch label="Notifications" initialState={true} />
        <ToggleSwitch label="Dark Mode" />
        <ToggleSwitch label="Auto-save" initialState={true} />
        <ToggleSwitch label="Sound Effects" initialState={true} />
        <ToggleSwitch label="Analytics" />
      </div>
    </div>
  )
}

function AccordionItem({ title, children }: { title: string; children: string }) {
  const open = new State(false)
  return (
    <div style="border: 1px solid #e5e5e5; border-radius: 0.5em; overflow: hidden;">
      <button onclick={() => open.set(!open.get())} style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0.75em 1em; border: none; background: #fafafa; cursor: pointer; font-size: 0.875rem; font-weight: 500; text-align: left;">
        <span>{title}</span>
        <span style="transition: transform 0.2s;">{() => open.get() ? "▾" : "▸"}</span>
      </button>
      {() => open.get() ? (
        <div style="padding: 0.75em 1em; font-size: 0.8125rem; color: #525252; line-height: 1.6; border-top: 1px solid #e5e5e5;">
          {children}
        </div>
      ) : null}
    </div>
  )
}

function FAQSection() {
  return (
    <div style="padding: 1.5em;">
      <h2 style="margin: 0 0 1em; font-size: 1.25rem; font-weight: 600;">FAQ</h2>
      <div style="display: flex; flex-direction: column; gap: 0.5em;">
        <AccordionItem title="What is Tama?">Tama is a reactive JSX runtime for building user interfaces with fine-grained reactivity and direct DOM rendering. It eliminates the virtual DOM overhead by inflating JSX directly into real DOM elements with reactive bindings.</AccordionItem>
        <AccordionItem title="How does it compare to React?">Unlike React, Tama does not use a virtual DOM or reconciliation algorithm. Instead, it uses fine-grained reactivity with @denshya/reactive to update only the specific DOM nodes that changed. This results in more predictable performance and smaller bundle sizes.</AccordionItem>
        <AccordionItem title="Is it production ready?">Tama is under active development and is used in production by several projects. The API surface is stable for core features, though some advanced features are still being refined.</AccordionItem>
        <AccordionItem title="How do I get started?">Install via npm with 'bun i @denshya/tama', configure your tsconfig.json to use Tama as the JSX runtime, and start building components with JSX and reactive state.</AccordionItem>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style="border-top: 1px solid #e5e5e5; padding: 1.5em; margin-top: 1em;">
      <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <div style="font-size: 0.8125rem; color: #737373;">© 2025 Tama. All rights reserved.</div>
        <div style="display: flex; gap: 1.5em;">
          <a href="/privacy" style="font-size: 0.8125rem; color: #737373; text-decoration: none;">Privacy</a>
          <a href="/terms" style="font-size: 0.8125rem; color: #737373; text-decoration: none;">Terms</a>
          <a href="/contact" style="font-size: 0.8125rem; color: #737373; text-decoration: none;">Contact</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div id="app-root" style="font-family: system-ui, -apple-system, sans-serif; color: #171717;">
      <Header />
      <main style="max-width: 960px; margin: 0 auto;">
        <div style="padding: 2em 1.5em; text-align: center;">
          <h1 style="font-size: 2rem; font-weight: 700; margin: 0 0 0.5em;">Build Faster with Tama</h1>
          <p style="font-size: 1.125rem; color: #525252; margin: 0 0 1.5em; line-height: 1.6;">A reactive JSX runtime with fine-grained reactivity and direct DOM rendering. No virtual DOM, no reconciliation, no hooks — just fast, predictable updates.</p>
          <div style="display: flex; gap: 0.75em; justify-content: center;">
            <button style="padding: 0.625em 1.5em; border: none; border-radius: 0.375em; background: #171717; color: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 500;">Get Started</button>
            <button style="padding: 0.625em 1.5em; border: 1px solid #d4d4d4; border-radius: 0.375em; background: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 500;">Learn More</button>
          </div>
        </div>
        <StatsGrid />
        <FeaturesSection />
        <CounterSection />
        <TogglesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}

// ── Bootstrap ─────────────────────────────────────────────

const root = document.createElement("div")
document.body.appendChild(root)

const inflator = new WebInflator
root.replaceChildren(inflator.inflate(<App />))
console.log("Tama rendered")
