import { State, StateOrPlain } from "@denshya/reactive"

import { castArray, isRecord } from "./common"


function isObservable(value: unknown): value is { subscribe: Function } {
  return value instanceof Object && typeof (value as any).subscribe === "function"
}

function bem(classNames: string | number | false | null | undefined | Array<string | number | false | null | undefined>, ...modifiers: any[]): string {
  const mods: any[] = []
  for (let i = 0; i < modifiers.length; i++) {
    const modifier = modifiers[i]
    if (isRecord(modifier)) {
      for (const key in modifier) {
        if (modifier[key]) mods.push(key)
      }
    } else if (Array.isArray(modifier)) {
      for (let j = 0; j < modifier.length; j++) {
        const m = modifier[j]
        if (m != null && m !== false) mods.push(m)
      }
    } else if (modifier != null && modifier !== false) {
      mods.push(modifier)
    }
  }

  const names = castArray(classNames)
  let result = ""
  for (let i = 0; i < names.length; i++) {
    const origin = names[i]
    if (!origin) continue
    let cls = "" + origin
    for (let j = 0; j < mods.length; j++) {
      const mod = mods[j]
      if (!mod) continue
      cls += " " + origin + "--" + mod
    }
    if (result) result += " "
    result += cls
  }
  return result
}

export function bemful(input: StateOrPlain<string | number | false | null | undefined> | StateOrPlain<string | number | false | null | undefined>[], ...mods: any[]): State<string> {
  function anyReactive() {
    if (isObservable(input)) return true
    if (Array.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        if (isObservable(input[i])) return true
      }
    }
    for (let i = 0; i < mods.length; i++) {
      const mod = mods[i]
      if (isRecord(mod)) {
        for (const key in mod) {
          if (isObservable(mod[key])) return true
        }
      } else if (Array.isArray(mod)) {
        for (let j = 0; j < mod.length; j++) {
          if (isObservable(mod[j])) return true
        }
      } else if (isObservable(mod)) {
        return true
      }
    }
    return false
  }

  if (!anyReactive()) {
    return bem(castArray(input) as any, ...mods) as unknown as State<string>
  }

  const classNames = castArray(input)
  const observableMods: any[] = new Array(mods.length + 1)
  observableMods[0] = State.collect(classNames)

  for (let i = 1; i < mods.length + 1; i++) {
    const mod = mods[i]
    if (isRecord(mod) || Array.isArray(mod)) {
      observableMods[i] = State.collect(mod)
    } else {
      observableMods[i] = mod
    }
  }

  return State.combine(observableMods, bem)
}
