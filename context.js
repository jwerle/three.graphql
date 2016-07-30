'use strict'

/**
 * Private context symbol
 */

const $symbol = Symbol('Context')
const $tag = Symbol('Tag')

/**
 * Creates a new Context instance with optional
 * initial state variables.
 *
 * @param {Object} [initial]
 * @return {Context}
 */

const createContext = module.exports = (initial) => new Context(initial)

/**
 * Context class.
 */

class Context {
  constructor(initial) {
    Object.assign(this, initial || {})
  }

  restore(property) {
    return restore(this, property)
  }

  commit(property, value) {
    return commit(this, property, value)
  }

  mesh(name) {
    return this[`mesh.${name}`]
  }

  material(name) {
    return this[`material.${name}`]
  }
}

/**
 * Restores a proprety on an object if found in its
 * context, otherwise null
 *
 * @param {Object} object
 * @param {String} property
 * @param {Object} [ctx]
 * @return {Mixed}
 */

const restore = module.exports.restore = (object, property, ctx) => {
  if (!object) {
    return null
  }

  if (object instanceof Context) {
    return object[property]
  }

  ctx = ctx || object[$symbol] || createContext()
  object[$symbol] = ctx
  return ctx[property]
}

/**
 * Commit a property into an objects context.
 *
 * @param {Object} object
 * @param {String} property
 * @param {Mixed} value
 */

const commit = module.exports.commit = (object, property, value) => {
  let ctx
  if (object instanceof Context) {
    ctx = object
  } else {
    ctx = object[$symbol]
  }

  if (ctx) {
    ctx[property] = value
    if (value) {
      value[$symbol] = ctx
    }
  }

  return value
}

const tag = module.exports.tag = (object, value) => {
  if (undefined !== value) {
    object[$tag] = value
  }

  return object[$tag]
}