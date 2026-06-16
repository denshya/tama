export function kebabCase(text: string): string {
  return text.replace(/(\p{Lu}+)/gu, "-$1").replace(/_/g, "-").toLowerCase()
}
