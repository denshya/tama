import { ProtonRef, ProtonRefOverload } from "./Proton/ProtonRef"

export const Ref: typeof ProtonRefOverload
export type Ref<T> = ProtonRef<T | null>
