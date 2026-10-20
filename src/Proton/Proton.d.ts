import { ProtonComponent as Component } from "./ProtonComponent"
import { ProtonDynamic as Dynamic } from "./ProtonDynamic"
import { ProtonLazy as Lazy } from "./ProtonLazy"
import { ProtonRef, ProtonRefOverload } from "./ProtonRef"
import { ProtonSwitch as Switch } from "./ProtonSwitch"

declare namespace Tama {
  export { Component, Dynamic, Lazy, Switch }
  export const Ref: typeof ProtonRefOverload
  export type Ref<T> = ProtonRef<T | null>
}

export default Tama
