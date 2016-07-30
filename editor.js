'use strict'

const ReactDOM = require('react-dom')
const React = require('react')
const GraphiQL = require('graphiql')
const ready = require('domready')
const tql = require('./')

const fov = 75.0
const far = 1000.0
const near = 1.0

ready(() => {
  const canvas = document.querySelector('#viewport canvas')
  const query = tql({canvas, rotation: {x: 0, y: 0}})
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
  const source = document.querySelector('#editor pre').textContent
  return source
}

function rotate(ctx) {
  ctx.rotation.x += 0.01
  ctx.rotation.y += 0.02
}
