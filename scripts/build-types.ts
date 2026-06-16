import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs"
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
  const code = rewriteAliases(result.code, dirname(absSource), dirname(absOutPath))
  writeFileSync(outPath, code)
}

console.log(`Generated ${files.length} declaration files`)
