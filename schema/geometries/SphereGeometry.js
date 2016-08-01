'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')

const implementation = exports.SphereGeometry = (context, args) => {
  const name = `sphere.${args.name || context.name}`

  const geometry = (
    restore(context, name) ||
    new three.SphereGeometry(width, height, depth)
  )

  Object.assign(geometry, {width, height, depth})

  if (width != geometry.width ||
      height != geometry.height ||
      depth != geometry.depth) {
    geometry = new three.SphereGeometry(width, height, depth)
  }


  if (context instanceof three.Mesh) {
    context.geometry = geometry
    try { context.updateMorphTargets() }
    catch (e) {
      console.warn(`failed: mesh.updateMorphTargets(): `+ e)
    }
  }

  return geometry
}
