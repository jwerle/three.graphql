'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')

/**
 * WebGLRenderer type implementation.
 *
 * @param {Query} query
 * @param {Object} args
 * @return {WebGLRenderer}
 */

const implementation = exports.WebGLRenderer = (context, args) => {
  const canvas = context.canvas || null
  const renderer = (
    restore(context, 'renderer', context) ||
    new three.WebGLRenderer(Object.assign({canvas}, args))
  )
  return commit(context, 'renderer', renderer)
}

// forward implementations
implementation.PerspectiveCamera = require('../cameras').PerspectiveCamera
implementation.Scene = require('../scenes').Scene

/**
 * Sets width and height
 *
 * @param {WebGLRenderer} self
 * @param {Object} args
 * @return {WebGLRenderer}
 */

implementation.setSize = (self, args) => {
  self.setSize(args.width, args.height)
  return self
}
