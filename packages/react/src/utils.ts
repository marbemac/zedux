import { AnyAtomTemplate, Ecosystem } from '@zedux/atoms'
import React, { createContext } from 'react'

export const ecosystemContext = createContext('@@global')

/**
 * These are copied from packages/atoms/src/utils/general.ts
 *
 * IMPORTANT: keep these in-sync with the ones in the atoms package
 */
export const Explicit = 1
export const External = 2
export const Static = 4
// export const Deferred = 8

export const destroyed = Symbol.for(`@@zedux/destroyed`)

export const getReactContext = (
  ecosystem: Ecosystem,
  atom: AnyAtomTemplate
) => {
  const reactStorage: Record<
    string,
    React.Context<any>
  > = (ecosystem._storage.react ||= {})

  return (reactStorage[atom.key] ||= createContext(
    undefined
  ) as React.Context<any>)
}
