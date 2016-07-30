'use strict'

/**
 * Module dependendies.
 */

const Object3D = require('../objects').Object3D
const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')
const tag = require('../../context').tag

/**
 * PerspectiveCamera type implementation
 */

const implementation = exports.PerspectiveCamera = (context, args) => {
  let camera = restore(context, 'camera')
  const aspect = args.aspect
  const near = args.near
  const far = args.far
  const fov = args.fov

  try {
    camera = new three.PerspectiveCamera(fov, aspect, near, far)
  } catch (e) {
    console.warn(e.stack || e)
  }

  if (camera) {
    Object.assign(camera, args)
    commit(context, 'camera', camera)
  }

  return camera
}

Object.assign(implementation, Object3D)

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
