'use strict'

/**
 * Module dependendies.
 */

const restore = require('../../context').restore
const commit = require('../../context').commit
const three = require('three')

/**
 * Object3D type implementation
 */

const implementation = exports.Object3D = new class {
  resolveType(value) {
    return value instanceof three.Object3D
  }
}
