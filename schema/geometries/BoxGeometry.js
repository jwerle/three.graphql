'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')

const implementation = exports.BoxGeometry = (context, args) => {
  const name = `box.${args.name || context.name}`
  const depth = args.depth
  const width = args.width
  const height = args.height
  const geometry = (
    restore(context, name) ||
    new three.BoxGeometry(width, height, depth)
  )

  Object.assign(geometry, {width, height, depth})

  if (width != geometry.width ||
      height != geometry.height ||
      depth != geometry.depth) {
    geometry = new three.BoxGeometry(width, height, depth)
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
