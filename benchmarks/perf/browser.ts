import { spawn } from "bun";
import { resolve } from "path";

// 1. Resolve and validate target file path
const rawPath = Bun.argv[2];

if (!rawPath) {
  console.error("❌ Error: Please provide a target file. Example: bun scripts/browser.ts ./some.ts");
  process.exit(1);
}

const targetFile = resolve(process.cwd(), rawPath);

if (!(await Bun.file(targetFile).exists())) {
  console.error(`❌ Error: File not found at absolute path: "${targetFile}"`);
  console.error(`Current Working Directory: "${process.cwd()}"`);
  process.exit(1);
}

const port = 8080;
let lastLogTime = Date.now();
let hasStarted = false;
const startTime = Date.now();

// Warmup tracking variables
let currentRun = 1;
let run3StartTime = 0;
let controlResolve: ((cmd: string) => void) | null = null;

console.log(`🔥 Warmup Run 1/2 starting...`);

// 2. Spin up the local dev server
const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // Log receiver route
    if (url.pathname === "/_log") {
      const text = await req.text();

      // Only stream logs to stdout on the final, active run
      if (currentRun === 3) {
        if (!run3StartTime) {
          run3StartTime = Date.now();
        }
        console.log(text);
      }

      hasStarted = true;
      lastLogTime = Date.now(); // Reset watchdog timer on log receipt
      return new Response("ok");
    }

    // Long poll connection for browser-side reload orchestration
    if (url.pathname === "/_control") {
      const promise = new Promise<string>((resolve) => {
        controlResolve = resolve;
      });
      const cmd = await promise;
      return new Response(cmd);
    }

    // HTML wrapper with injected fake terminal env, log redirector, and control poller
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <script>
              // Inject Fake Terminal Environment for ANSI detection tools
              globalThis.process = {
                env: {
                  FORCE_COLOR: '1',
                  TERM: 'xterm-256color'
                },
                argv: ['--color'],
                platform: 'linux',
                stdout: {
                  isTTY: true
                }
              };

              // Helper to resolve string formatting (%s, %d, %c, etc) sequentially and iteratively
              function formatLog(...args) {
                let result = '';
                let argIndex = 0;

                if (args.length === 0) return '';

                while (argIndex < args.length) {
                  let current = args[argIndex++];

                  if (typeof current === 'string') {
                    // Check if current string has specifiers and if we have arguments left to consume
                    const hasSpecifiers = /%[sjdifOoc]/g.test(current);
                    if (hasSpecifiers && argIndex < args.length) {
                      current = current.replace(/%[sjdifOoc]/g, (match) => {
                        if (argIndex >= args.length) return match;
                        const val = args[argIndex++];
                        if (match === '%c') return ''; // Strip browser-specific CSS styling
                        if (match === '%j' || match === '%o' || match === '%O') {
                          return typeof val === 'object' ? JSON.stringify(val) : String(val);
                        }
                        return String(val);
                      });
                    }
                    result += (result ? ' ' : '') + current;
                  } else {
                    const valStr = typeof current === 'object' ? JSON.stringify(current) : String(current);
                    result += (result ? ' ' : '') + valStr;
                  }
                }
                return result;
              }

              // Re-route browser console logs to the Bun terminal
              const _log = console.log;
              console.log = (...args) => {
                _log(...args);

                fetch('/_log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain' },
                  body: formatLog(...args)
                });
              };

              // Monitor paint metrics (FCP and LCP) and log them
              try {
                const paintObserver = new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                      console.log(\`⏱️ FCP: \${entry.startTime.toFixed(2)}ms\`);
                    }
                  }
                });
                paintObserver.observe({ type: 'paint', buffered: true });

                const lcpObserver = new PerformanceObserver((entryList) => {
                  const entries = entryList.getEntries();
                  if (entries.length > 0) {
                    const lastEntry = entries[entries.length - 1];
                    console.log(\`⏱️ LCP: \${lastEntry.startTime.toFixed(2)}ms\`);
                  }
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
              } catch (e) {
                _log('⚠️ PerformanceObserver metrics initialization failed:', e);
              }

              // Listen for instruction reload signals from Bun
              async function listenForControl() {
                try {
                  const res = await fetch('/_control');
                  const cmd = await res.text();
                  if (cmd === 'reload') {
                    window.location.reload();
                  }
                } catch (e) {}
              }
              listenForControl();

              // Automatically catch and route unhandled browser runtime errors
              window.addEventListener('error', (e) => {
                console.log('❌ Browser Runtime Error: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
              });
            </script>
          </head>
          <body>
            <script type="module" src="/_target_script.ts"></script>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Serve on-the-fly bundled file
    if (url.pathname === "/_target_script.ts") {
      const build = await Bun.build({
        entrypoints: [targetFile],
        target: "browser",
        plugins: [
          {
            name: "bypass-happy-dom",
            setup(build) {
              // Mock core 'happy-dom'
              build.onResolve({ filter: /^happy-dom$/ }, () => ({ path: "happy-dom", namespace: "mock-happy-dom" }));
              build.onLoad({ filter: /.*/, namespace: "mock-happy-dom" }, () => ({
                contents: `export class Window { constructor() { return window; } }`,
                loader: "js",
              }));

              // Mock '@happy-dom/global-registrator'
              build.onResolve({ filter: /^@happy-dom\/global-registrator$/ }, () => ({ path: "global-registrator", namespace: "mock-global-registrator" }));
              build.onLoad({ filter: /.*/, namespace: "mock-global-registrator" }, () => ({
                contents: `export const GlobalRegistrator = { register() {}, unregister() {} };`,
                loader: "js",
              }));
            },
          },
        ],
      });

      if (!build.success) {
        console.error("❌ Bun build failed:");
        console.error(build.logs.join("\n"));
        return new Response("Build Error", { status: 500 });
      }

      const compiledJs = await build.outputs[0].text();
      return new Response(compiledJs, { headers: { "Content-Type": "application/javascript" } });
    }

    return new Response("Not Found", { status: 404 });
  },
});

// 3. Launch Chrome (Ignoring stdout/stderr streams to suppress driver/NSS logs)
const browserProcess = spawn({
  cmd: ["google-chrome", `http://localhost:${port}`, "--headless=new"],
  stdout: "ignore",
  stderr: "ignore",
});

// 4. Inactivity Watchdog & Multi-Run Orchestrator
const watchdog = setInterval(() => {
  if (!hasStarted) {
    // Fail safe if browser doesn't send logs within 7 seconds of starting
    if (Date.now() - startTime > 7000) {
      console.error("❌ Error: Browser timed out before producing any logs.");
      cleanup();
      process.exit(1);
    }
    return;
  }

  // Shut down or reload browser if we detect 1.5 seconds of absolute silence
  if (Date.now() - lastLogTime > 1500) {
    if (currentRun < 3) {
      if (controlResolve) {
        const finishedRun = currentRun;
        currentRun++;
        hasStarted = false;
        lastLogTime = Date.now();

        console.log(`✨ Warmup Run ${finishedRun}/2 completed.`);
        if (currentRun === 3) {
          console.log(`\n⚡ Run 3/3 (Active Performance Run):`);
        } else {
          console.log(`🔥 Warmup Run ${currentRun}/2 starting...`);
        }

        controlResolve("reload");
        controlResolve = null;
      }
    } else {
      const duration = lastLogTime - run3StartTime;
      console.log(`\n⏱️ Main code execution duration: ${duration}ms`);
      cleanup();
      process.exit(0);
    }
  }
}, 200);

function cleanup() {
  clearInterval(watchdog);
  browserProcess.kill();
  server.stop();
}
