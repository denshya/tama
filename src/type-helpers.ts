/**
 * Structural type helpers adopted from `type-fest`.
 *
 * They live in the source tree so published declarations do not depend on an
 * external, dev-only package.
 */

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint

/** Flattens intersections into a single object type. */
export type Simplify<T> = { [Key in keyof T]: T[Key] } & {}

/** Preserves literal autocompletion while still allowing a wider base type. */
export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  LiteralType | (BaseType & Record<never, never>)

/** Structural equality that does not treat `any` or intersections loosely. */
export type IsEqual<A, B> =
  [A] extends [B]
    ? [B] extends [A]
      ? _IsEqual<A, B>
      : false
    : false

type _IsEqual<A, B> =
  (<G>() => G extends A & G | G ? 1 : 2) extends
  (<G>() => G extends B & G | G ? 1 : 2)
    ? true
    : false
