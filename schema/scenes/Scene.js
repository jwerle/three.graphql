'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')

/**
 * Scene type implementation
 */

const implementation = exports.Scene = (context, args) => {
  //const scene = restore(context, 'scene') || new three.Scene()
  const scene = new three.Scene()
  return commit(context, 'scene', scene)
}

// forward implementations
implementation.Mesh = require('../objects').Mesh

implementation.setPosition = (context, args) => {
  Object.assign(context.position, args)
}

implementation.setRotation = (context, args) => {
  Object.assign(context.rotation, args)
}

implementation.setQuaternion = (context, args) => {
  Object.assign(context.quaternion, args)
}

implementation.setScale = (context, args) => {
  Object.assign(context.scale, args)
}
