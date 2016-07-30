'use strict'

/**
 * Module dependendies.
 */

const createContext = require('./context')
const schema = require('./schema')
const ready = require('domready')
const graph = require('graphql').graphql

// graphql(schema, ...) lazy bind
const G = graph.bind(graph, schema)

/**
 * Returns a function suitable for running a graphql
 * query for the created context.
 *
 * @param {Object} opts
 * @param {Object} [ctx]
 * @return {Function}
 */

module.exports = createWrapper
function createWrapper(opts, ctx) {
  const context = ctx || createContext(opts)
  const wrap = (v) => 'function' == typeof v ? v : () => v

  query.graph = G
  query.render = render
  query.context = context

  return query

  function query(input) {
    if (String(input).match(/IntrospectionQuery/i)) {
      return G(input)
    } else {
      return G(wrap(input)(context),
               context,
               context,
               context.store)
      .then(respond)
      .then(render)
    }
  }

  function respond(res) {
    if (res.errors) { throw res.errors[0] }
    else { return res.data }
  }

  function render() {
    const renderer = context.restore('renderer')
    const camera = context.restore('camera')
    const scene = context.restore('scene')

    if (renderer && camera && scene) {
      if (document.body.contains(renderer.domElement)) {
        renderer.render(scene, camera);
      }
    }

    return context
  }
}
