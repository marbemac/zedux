import { createActor, createActorCreator } from '../utils/actor'


/**
  Factory for creating ZeduxActors.

  Actors are like action creators with a little extra functionality.

  They can be passed directly to a ZeduxReactor's `to*()` methods, thus
  removing the necessity of string constants.

  They also have an error() method that'll create basic action objects
  with the actor's action type and `error: false`.
*/
export const act = createActorCreator(createActor)


/**
  Partially applies act() with one or more namespace nodes.

  This will prefix all actors created with the bound act() function
  with the given namespace (joined by slashes - "/").
*/
act.namespace = function(...namespaceNodes) {
  return act.bind(null, ...namespaceNodes)
}
