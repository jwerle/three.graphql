'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')
const tag = require('../../context').tag

/**
 * Mesh type implementation
 */

const implementation = exports.Mesh = (context, args) => {
  const name = `mesh.${args.name || tag(context) || ''}`
  const mesh = restore(context, name) || new three.Mesh()
  if (context instanceof three.Scene) {
    context.add(mesh)
  }
  tag(mesh, name)
  return commit(context, name, mesh)
}

// forward declaratiosn
implementation.MeshBasicMaterial = require('../materials').MeshBasicMaterial
implementation.BoxGeometry = require('../geometries').BoxGeometry

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
