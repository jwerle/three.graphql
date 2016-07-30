'use strict'

/**
 * Color type
 */

exports.Color = {
  parseValue(value) {
    return parseInt(String(value))
  },

  serialize(value) {
    return parseInt(String(value))
  }
}
