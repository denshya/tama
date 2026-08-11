import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { isolatedDeclarationSync } from "oxc-transform"
import { ResolverFactory } from "oxc-resolver"

const SRC = "src"
const OUT = "build"
const ABS_SRC = join(process.cwd(), SRC)
const ABS_OUT = join(process.cwd(), OUT)

const resolver = new ResolverFactory({
  conditionNames: ["node", "import"],
  tsconfig: {
    configFile: join(process.cwd(), "tsconfig.json")
  },
  extensions: [".ts", ".tsx"],
  symlinks: false,
})

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(path))
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      files.push(path)
    }
  }
  return files
}

const { writeFileSync: rawWriteFileSync } = { writeFileSync }

function writeWithManualOverride(path: string, content: string) {
  const manual = join(ABS_SRC, relative(ABS_OUT, join(process.cwd(), path)))
  if (existsSync(manual)) return
  writeFileSync(path, content)
}

function stripInternal(code: string): string {
  const lines = code.split("\n")
  const keep = new Array<boolean>(lines.length).fill(true)

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "/** @internal */") continue

    keep[i] = false
    i++

    if (i >= lines.length) break

    let braceDepth = 0
    let j = i
    while (j < lines.length) {
      for (const ch of lines[j]) {
        if (ch === "{") braceDepth++
        else if (ch === "}") braceDepth--
      }
      keep[j] = false
      j++
      if (braceDepth === 0) break
    }
    i = j - 1
  }

  return lines.filter((_, i) => keep[i]).join("\n")
}

function rewriteAliases(code: string, sourceDir: string, outDir: string): string {
  const resolveImport = (importPath: string): string | null => {
    const resolved = resolver.sync(sourceDir, `@/${importPath}`)
    if (!resolved.path || !resolved.path.startsWith(ABS_SRC)) return null
    const declPath = resolved.path.replace(ABS_SRC, ABS_OUT).replace(/\.tsx?$/, ".d.ts")
    let rel = relative(outDir, declPath)
    if (!rel.startsWith(".")) rel = "./" + rel
    return rel.replace(/\.d\.ts$/, "")
  }

  return code
    .replace(/from\s+["']@\/([^"']+)["']/g, (match, importPath) => {
      const resolved = resolveImport(importPath)
      return resolved !== null ? `from "${resolved}"` : match
    })
    .replace(/import\s+["']@\/([^"']+)["']/g, (match, importPath) => {
      const resolved = resolveImport(importPath)
      return resolved !== null ? `import "${resolved}"` : match
    })
}

const files = walk(SRC)

for (const file of files) {
  const sourceText = readFileSync(file, "utf-8")
  const result = isolatedDeclarationSync(file, sourceText)

  if (result.errors.length > 0) {
    console.error(`Errors in ${relative(process.cwd(), file)}:`, result.errors)
    continue
  }

  const relativePath = relative(SRC, file)
  const outPath = join(OUT, relativePath.replace(/\.tsx?$/, ".d.ts"))
  mkdirSync(dirname(outPath), { recursive: true })

  const absSource = join(process.cwd(), file)
  const absOutPath = join(process.cwd(), outPath)
  let code = stripInternal(result.code)
  code = rewriteAliases(code, dirname(absSource), dirname(absOutPath))
  if (code.trim()) {
    writeWithManualOverride(outPath, code)
  } else {
    writeWithManualOverride(outPath, "export {};\n")
  }
}

console.log(`Generated ${files.length} declaration files`)
