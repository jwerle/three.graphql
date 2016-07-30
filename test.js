'use strict'

const ready = require('domready')
const tql = require('./')

const fov = 75.0
const far = 1000.0
const near = 1.0

ready(() => {
  const canvas = document.createElement('canvas')
  const query = tql({canvas, rotation: {x: 0, y: 0}})
  document.body.appendChild(canvas)
  requestAnimationFrame(tick)
  function tick() {
    requestAnimationFrame(tick)
    query(render).then(rotate).catch((err) => console.error(err))
  }
})

function render(ctx) {
  const height = window.innerHeight
  const width = window.innerWidth
  const aspect = width / height
  return `{
    WebGLRenderer {
      setSize(width: ${width}, height: ${height})
      PerspectiveCamera(fov: ${fov}, aspect: ${aspect}, near: ${near}, far: ${far}) {
        setPosition(z: 500)
      }
      Scene {
        Mesh(name: "box") {
          geometry: BoxGeometry(width: 200, height: 200, depth: 200)
          material: MeshBasicMaterial(wireframe: true)
          setRotation(x: ${ctx.rotation.x}, y: ${ctx.rotation.y})
        }
      }
    }
  }`
}

function rotate(ctx) {
  ctx.rotation.x += 0.01
  ctx.rotation.y += 0.02
}
