(function ()
{
  if (typeof(window) !== 'undefined') {
    // browser
    var Graph = window.Graph;
  } else if (typeof(require) !== 'undefined') {
    // commonjs
    var Graph = exports.Graph = require("./graph").Graph;
  } else if (typeof(load) !== 'undefined') {
    // jsc
    var Graph = load('lib/graph.js').Graph;
  }
  
  Graph.prototype.subgraph = function (vertices)
  {
    var g = new Graph();
    
    vertices = dict(vertices);
    for (var v in vertices)
      for (var u in this.adj(v))
        if (u in vertices)
          g.set(this.vertex(v), this.vertex(u), this.get(v, u));
    
    return g;
  }
  
  Graph.prototype.cross = function (g)
  {  
    var vertices = [];
    
    for (var i = 0; i < this._vertices.length; i++)
    {
      for (var j = 0; j < g._vertices.length; j++)
      {
        vertices.push([this._vertices[i], g._vertices[j]]);
      }
    }
    
    return vertices;
  }
  
  Graph.prototype.cartesian = function (g)
  {
    var h = new Graph();
    var vertices = this.cross(g);
    
    for (var i = 0; i < vertices.length; i++)
    {
      for (var j = 0; j < vertices.length; j++)
      {
        var u = vertices[i], v = vertices[j];
        if (u[0] === v[0] && g.get(u[1], v[1]) || this.get(u[0], v[0]) && u[1] === v[1])
        {
          h.set(u, v);
        }
      }
    }
    
    return h;
  }
  
  Graph.prototype.tensor = function (g)
  {
    var h = new Graph();
    var vertices = this.cross(g);
    
    for (var i = 0; i < vertices.length; i++)
    {
      for (var j = 0; j < vertices.length; j++)
      {
        var u = vertices[i], v = vertices[j];
        if (this.get(u[0], v[0]) && g.get(u[1], v[1]))
          h.set(u, v);
      }
    }
    
    return h;
  }
  
  Graph.prototype.union = function (g)
  {
    var h = this.copy();
    
    g.each(function (v)
    {
      for (var u in g.adj(v))
      {
        h.set(v, u, g.get(v, u));
      }
    });
    
    return h;
  }
  
  Graph.prototype.is_bipartite = function ()
  {
    var seen = 0;
    var fringe = [];
    var color = {};
    var vertices = dict(this._vertices);
    
    while (seen < this._vertices.length)
    {
      // populate fringe with an uncolored vertex
      if (fringe.length === 0)
      {
        for (var v in vertices)
        {
          // move from vertices to fringe
          color[v] = true;
          fringe.push(v);
          break;
        }
      }
      
      // consume v from fringe
      var v = fringe.shift();
      delete vertices[v];
      seen++;
      
      // color neighbors u of v
      for (var u in this.adj(v))
      {
        // did we already color neighbor u?
        if (u in color)
        {
          // fails when adjacent vertices have the same color
          if (color[u] === color[v])
            return false;
        } else {
          // give neighbor u the opposite color of v, add to fringe
          color[u] = !color[v];
          fringe.push(u);
        }
      }
    }
    
    return true;
  }
  
  Graph.prototype.is_complete = function ()
  {
    var order = this.order() - this.grep(
      function (v) {
        // remove self edges
        return v in this.adj(v);
      }).length;
    
    return this.size() === order * (order - 1) / 2;
  }
  
  Graph.prototype.is_cycle = function ()
  {
    if (this.order() !== this.size())
      return false;
      
    var visited = {};
    var seen = 0;
    var v = this._vertices[0];
    
    while (!(v === undefined || v in visited))
    {
      visited[v] = 1;
      seen++;
      for (var u in this.adj(v))
        if (!(u in visited))
          v = u;
    }
    
    return seen === this.order();
  }
  
  Graph.prototype.is_subgraph = function (g)
  {
    return this.grep(function (v)
    {
      for (var u in this.adj(v))
        if (!g.has(v, u))
          return false;
        
      return true;
    }).length === this.order();
  }
  
  Graph.prototype.bipartite_double_cover = function ()
  {
    return this.tensor(Graph.k(2));
  }
  
  Graph.peterson = function (vertices)
  {
    if (vertices === undefined)
      vertices = [1,2,3,4,5,6,7,8,9,10];
    
    var g = new Graph();
    
    g.set(vertices[0], vertices[1]);
    g.set(vertices[1], vertices[2]);
    g.set(vertices[2], vertices[3]);
    g.set(vertices[3], vertices[4]);
    g.set(vertices[4], vertices[0]);
    
    g.set(vertices[5], vertices[7]);
    g.set(vertices[6], vertices[8]);
    g.set(vertices[7], vertices[9]);
    g.set(vertices[8], vertices[5]);
    g.set(vertices[9], vertices[6]);
    
    g.set(vertices[0], vertices[5]);
    g.set(vertices[1], vertices[6]);
    g.set(vertices[2], vertices[7]);
    g.set(vertices[3], vertices[8]);
    g.set(vertices[4], vertices[9]);
    
    return g;
  }
  
  Graph.k = function (n, vertices)
  { 
    var g = new Graph();
    
    for (var i = 0; i < n; i++)
      for (var j = 0; j < n; j++)
        if (i != j)
          g.set(vertices ? vertices[i] : i, vertices ? vertices[j] : j);
    
    return g;
  }
  
  Graph.c = function (n, vertices)
  {
    var g = new Graph();
    
    
    for (var i = 0; i < n; i++)
    {
      var j = (i+1) % n;
      g.set(vertices ? vertices[i] : i, vertices ? vertices[j] : j);
    }
    
    return g;
  }
  
  function dict (seq, val)
  {
    if (seq.constructor === Object)
      return seq;
    
    var obj = {};
    
    if (val === undefined)
      val = 1;
    
    for (var i = 0; i < seq.length; i++)
      obj[seq[i]] = val;
    
    return obj;
  }

  if (typeof(load) !== 'undefined') {
    // jsc
    return {
      "Graph": Graph
    };
  }
}());
