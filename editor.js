'use strict'

const createQuery = require('./')
const GraphiQL = require('graphiql')
const ReactDOM = require('react-dom')
const React = require('react')
const ready = require('domready')
const vm = require('vm')

let query
let currentQuerySource = null

const kDefaultQuery = `
## Renders a scene into a viewport with
## a PerspectiveCamera and a Scene containing
## a Mesh constructed with a BoxGeometry and
## a MeshBasicMaterial
query render($width: Float,
             $height: Float,
             #$rotateX: Float,
             #$rotateY: Float
             $tickr: Float) {
  ## Describes renderer
  WebGLRenderer {
    ## set viewport width/height based on context inputs
    setSize(width: $width, height: $height)

    ## Configures a PerspectiveCamera
    PerspectiveCamera(fov: 75, aspect: 1, near: 1, far: 10000) {
      setPosition(z: 500)
    }

    ## Describes a Scene
    Scene {

      ## Describes a named Mesh
      a: Mesh(name: "box-a") {
        setRotation(x: $tickr)
        setPosition(x: 200, y: 200)
        ...BoxWireframe
      }

      b: Mesh(name: "box-b") {
        setPosition(x: -200, y: -200)
        setRotation(y: $tickr)
        ...Box
      }

      c: Mesh(name: "box-c") {
        setRotation(z: $tickr)
        setPosition(x: 0)
        ...Box
      }
    }
  }
}

fragment BoxWireframe on Mesh {
  ## Contruct geometry and material for mesh
  BoxGeometry(width: 100, height: 100, depth: 100)
  MeshBasicMaterial(wireframe: true)
}

fragment Box on Mesh {
  BoxGeometry(width: 100, height: 100, depth: 100)
  MeshBasicMaterial(wireframe: false)
}
`

ready(() => {
  const canvas = document.querySelector('#viewport canvas')
  query = createQuery({canvas})
  requestAnimationFrame(tick)
  function tick() {
    requestAnimationFrame(tick)

    const wrap = document.querySelector('#graphiql .resultWrap')
    const style = wrap ? getComputedStyle(wrap) : {
      width: window.innerWidth * .49,
      height: window.innerHeight - 48
    }

    const width = parseFloat(style.width)
    const height = parseFloat(style.height)

    query.context.set('width', width)
    query.context.set('height', height)

    query(currentQuerySource || kDefaultQuery)
    .catch((err) => console.error(err))
  }
})

ready(() => {
  const domElement = document.getElementById('graphiql')
  const reactElement = React.createElement(GraphiQL, {
    query: currentQuerySource || kDefaultQuery,
    fetcher: fetcher,
    variables: '',
    onEditQuery: onEditQuery,
    onEditVariables: onEditVariables,
  })

  ReactDOM.render(reactElement, domElement)

  function fetcher(params) {
    let vars = {}
    if (params.variables) {
      try { vars = JSON.parse(params.variables) }
      catch (e) { }
      for (let key in vars) {
        query.context.set(key, vars[key])
      }
    }
    return query(params.query)
  }

  function onEditQuery (q) {
    currentQuerySource = q
  }

  function onEditVariables(value) {
    let parsed
    try { parsed = JSON.parse(value) }
    catch (e) { }
    if (parsed && 'object' == typeof parsed) {
      query.context.extend(parsed)
    }
  }
})
