'use strict'

/**
 * Module dependendies.
 */

const createSchema = require('graph.ql')
const path = require('path')
const fs = require('fs')

const EXTNAME = '.graphql'
const files = []
const buffers = []
const addFile = (file) =>
  files.push(path.resolve(__dirname, `${file}${EXTNAME}`))

const map = {
  'scalars': {
    implementation: require('./scalars'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/scalars.graphql'),
    ])
  },

  'math': {
    implementation: require('./math'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/math/Euler.graphql'),
      fs.readFileSync(__dirname + '/math/Matrix3.graphql'),
      fs.readFileSync(__dirname + '/math/Matrix4.graphql'),
      fs.readFileSync(__dirname + '/math/Vector2.graphql'),
      fs.readFileSync(__dirname + '/math/Vector3.graphql'),
      fs.readFileSync(__dirname + '/math/Vector4.graphql'),
      fs.readFileSync(__dirname + '/math/Quaternion.graphql'),
      fs.readFileSync(__dirname + '/cameras/PerspectiveCamera.graphql'),
    ])
  },

  'geometries': {
    implementation: require('./geometries'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/geometries/BoxGeometry.graphql'),
    ])
  },

  'materials': {
    implementation: require('./materials'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/materials/Material.graphql'),
      fs.readFileSync(__dirname + '/materials/MeshBasicMaterial.graphql'),
    ])
  },

  'objects': {
    implementation: require('./objects'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/objects/Object3D.graphql'),
      fs.readFileSync(__dirname + '/objects/Mesh.graphql'),
    ])
  },

  'cameras': {
    implementation: require('./cameras'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/cameras/PerspectiveCamera.graphql'),
    ])
  },

  'scenes': {
    implementation: require('./scenes'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/scenes/Scene.graphql'),
    ])
  },

  'renderers': {
    implementation: require('./renderers'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/renderers/WebGLRenderer.graphql'),
    ])
  },

  'queries': {
    implementation: require('./queries'),
    buffer: Buffer.concat([
      fs.readFileSync(__dirname + '/queries/Query.graphql'),
    ])
  },
}

// @TODO(werle) - only do this for debug
const buffer = (Object.keys(map)
  .map((key) => ({name: key, buffer: map[key].buffer}))
  .map((type) => Buffer.concat([
    Buffer('\n'),
    Buffer('## source: '),
    Buffer(type.name),
    Buffer('\n'),
    type.buffer
  ]))
  .reduce((output, input) => Buffer.concat([output, input]), Buffer(0))
)

const implementations = Object
.keys(map)
.map((key) => map[key])
.reduce((i, type) => Object.assign(i, type.implementation), {})

module.exports = createSchema(String(buffer), implementations).schema
