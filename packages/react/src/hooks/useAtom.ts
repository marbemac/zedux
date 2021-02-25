import { Context, createContext, useMemo } from 'react'
import {
  AppAtomInstance,
  AppAtomConfig,
  AtomConfig,
  AtomValue,
  GlobalAtomInstance,
  GlobalAtomConfig,
  LocalAtomInstance,
  LocalAtomConfig,
  ReadonlyAppAtomInstance,
  ReadonlyAppAtomConfig,
  ReadonlyGlobalAtomInstance,
  ReadonlyGlobalAtomConfig,
  ReadonlyLocalAtomInstance,
  ReadonlyLocalAtomConfig,
  Atom,
  AtomBaseProperties,
  Scope,
  AtomInstance,
} from '../types'
import { EMPTY_CONTEXT, generateImplementationId } from '../utils'
import { createAtom } from '../utils/createAtom'
import { useAtomWithSubscription } from './useAtomWithSubscription'

type Key<Params extends any[] = []> = string | [string, ...Params]

export const useAtom: {
  // Basic atom(key, val) overload:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    // raw value overload can't be supported - we wouldn't know if an object was an *AtomConfig object or the desired initial state
    value: (...params: Params) => AtomValue<State>
  ): AppAtomInstance<State, Params, Methods>
  // ReadonlyGlobalAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: ReadonlyGlobalAtomConfig<State, Params>
  ): ReadonlyGlobalAtomInstance<State, Params, Methods>
  // GlobalAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: GlobalAtomConfig<State, Params>
  ): GlobalAtomInstance<State, Params, Methods>
  // ReadonlyAppAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: ReadonlyAppAtomConfig<State, Params>
  ): ReadonlyAppAtomInstance<State, Params, Methods>
  // AppAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: AppAtomConfig<State, Params>
  ): AppAtomInstance<State, Params, Methods>
  // ReadonlyLocalAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: ReadonlyLocalAtomConfig<State, Params>
  ): ReadonlyLocalAtomInstance<State, Params, Methods>
  // LocalAtom:
  <
    State = any,
    Params extends any[] = [],
    Methods extends Record<string, () => any> = Record<string, () => any>
  >(
    key: Key<Params>,
    options: LocalAtomConfig<State, Params>
  ): LocalAtomInstance<State, Params, Methods>
} = <State, Params extends any[], Methods extends Record<string, () => any>>(
  paramA: Key<Params> | AtomConfig<State, Params>,
  maybeFactory?: Atom<State, Params, Methods>['value']
) => {
  const params = (Array.isArray(paramA) ? paramA.slice(1) : undefined) as Params

  const newAtom = useMemo(() => {
    if (!paramA) {
      throw new TypeError('Zedux - All atoms must have a key')
    }

    let options: AtomConfig<State, Params>

    if (typeof paramA === 'object' && !Array.isArray(paramA)) {
      options = paramA
    } else {
      options = {
        value: maybeFactory,
        key: Array.isArray(paramA) ? paramA[0] : paramA,
      }
    }

    const { flags, key, readonly, scope = Scope.App, value } = options

    let reactContext: Context<AtomInstance<State, Params, Methods>>
    const getReactContext = () => {
      if (reactContext) return reactContext

      return (reactContext = createContext(EMPTY_CONTEXT as any))
    }

    const newAtom: AtomBaseProperties<State, Params, Methods> = {
      getReactContext,
      internalId: generateImplementationId(),
      flags,
      key,
      readonly,
      scope,
      value,
    }

    createAtom<State, Params, Methods>(newAtom, options)

    return newAtom
  }, [])

  return useAtomWithSubscription(newAtom, params)
}
