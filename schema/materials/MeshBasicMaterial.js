'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')
const tag = require('../../context').tag

/**
 * MeshBasicMaterial type
 */

const implementation = exports.MeshBasicMaterial = (context, args) => {
  const name = `material.${args.name || tag(context) || ''}`
  let material = restore(context, name) || new three.MeshBasicMaterial(args)
  if (context instanceof three.Mesh) {
    material = (
      context.material instanceof three.MeshBasicMaterial
        ? context.material : material
    )

    context.material = material
    Object.assign(material, args)
  }

  tag(material, name)
  return commit(context, name, material)
}
