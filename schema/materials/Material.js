'use strict'

const three = require('three')

/**
 * Material interface type.
 */

const implementation = exports.Material = new class {
  resolveType(value) {
    return value instanceof three.Material
  }
}
