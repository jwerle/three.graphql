(function ()
{
  var ANTIEDGE = false;
  
  var Graph = function (graph) {
    this._graph = {}; // {u: {v: edge, ...}, ...}
    this._degree = {}; // {u: degree, ...}
    this._indegree = {}; // {u: degree, ...}
    this._vertices = []; // [u, v, ...]
    this._vertex = {}; // {u: u, ...}
    this._size = 0;
    
    if (graph)
    {
      // copy input graph
      for (var u in graph)
      {
        var adj = graph[u];
        if (adj.constructor === Object)
        {
          for (var v in adj)
          {
            this.set(u, v, adj[v]);
          }
        } else if (adj.constructor === Array)
        {
          for (var i = 0; i < adj.length; i++)
          {
            this.set(u, adj[i]);
          }
        }
      }
    }
  }
  
  Graph.prototype.vertex = function (id)
  {
    if (id in this._vertex)
      return this._vertex[id];
  }
  
  Graph.prototype.copy = function ()
  {
    return new Graph(this._graph);
  }
  
  Graph.prototype.adj = function (u)
  {
    return this._graph[u];
  }
  
  Graph.prototype.get = function (u, v)
  {
    if (this._graph[u])
      return this._graph[u][v];
  }
  
  Graph.prototype.has = function (u, v)
  {
    return this.get(u, v) !== undefined;
  }
  
  Graph.prototype.degree = function (u)
  {
    return this._degree[u];
  }
  
  Graph.prototype.indegree = function (u)
  {
    return this._indegree[u];
  }
  
  Graph.prototype.size = function ()
  {
    return this._size;
  }
  
  Graph.prototype.order = function ()
  {
    return this._vertices.length;
  }
  
  Graph.prototype.each = function (f)
  {
    for (var i = 0; i < this._vertices.length; i++)
    {
      if (f.call(this, this._vertices[i], i) === false)
        break;
    }
  }
  
  Graph.prototype.grep = function (f)
  {
    var vertices = [];
    this.each(function (v, i)
    {
      if (f.call(this, v, i))
        vertices.push(v);
    });
    return vertices;
  }
  
  Graph.prototype.set = function (u, v, edge)
  {
    // set('a', '-b', ...) is a synonym for dir('a', 'b', ...)
    if (v[0] == '-') {
      return this.dir(u, v.substr(1), edge);
    }
    
    // take an undefined edge as simply 'true' for convenience
    edge = (edge === undefined ? true : edge);
    
    // increment/decrement size
    if (edge !== ANTIEDGE && !this.has(u, v) && !this.has(v, u))
    {
      this._size++;
    } else if (edge === ANTIEDGE && (this.has(u, v) || this.has(v, u)))
    {
      this._size--;
    }
    
    // set/unset edges and increment/decrement degrees
    _set(this, u, v, edge);
    _set(this, v, u, edge);
    
    return edge;
  }
  
  Graph.prototype.dir = function (u, v, edge)
  {
    // take an undefined edge as simply 'true' for convenience
    edge = (edge === undefined ? true : edge);
    
    // increment/decrement size
    if (edge !== ANTIEDGE && !(this.has(u, v) || this.has(v, u)))
    {
      this._size++;
    } else if (edge === ANTIEDGE && this.has(u, v) && !this.has(v, u))
    {
      this._size--;
    }
    
    // set/unset edge and increment/decrement degree
    _set(this, u, v, edge);
    
    return edge;
  }
  
  Graph.prototype.drop = function (v)
  {
    if (!(v in this._degree))
      return false;
    
    // remove adjacent edges
    for (var u in this.adj(v))
    {
      this.del(v, u);
    }
    
    // remove from vertex list
    for (var i = 0; i < this._vertices.length; i++)
    {
      if (this._vertices[i] === v)
      {
        this._vertices.splice(i, 1);
        break;
      }
    }
    
    // remove from degree indexes
    delete this._degree[v];
    delete this._indegree[v];
    
    return true;
  }
  
  Graph.prototype.del = function (u, v)
  {
    // remove vertex
    if (v === undefined)
      return this.drop(u);
    
    // remove edge
    return this.set(u, v, ANTIEDGE);
  }
  
  Graph.prototype.deldir = function (u, v)
  {
    return this.dir(u, v, ANTIEDGE);
  }
    
  function _set (g, u, v, e)
  {
    // add to vertex list if the degree is unknown
    if (!(u in g._degree))
    {
      g._vertices.push(u);
      g._vertex[u] = u;
      g._degree[u] = g._indegree[u] = 0;
    }
    
    if (!(v in g._degree))
    {
      g._vertices.push(v);
      g._vertex[v] = v;
      g._degree[v] = g._indegree[v] = 0;
    }
    
    // we are setting an edge
    if (e !== ANTIEDGE)
    {
      // we have a *new* edge
      if (!g.has(u, v))
      {
        g._degree[u]++;
        g._indegree[v]++;
      }
      
      // add to adjacency list
      g._graph[u] = g._graph[u] || {};
      g._graph[u][v] = e;
    }
    // we are deleting an existing edge
    else if (g.has(u, v))
    {
      // remove from adjacency list
      delete g._graph[u][v];
      g._degree[u]--;
      g._indegree[v]--;
    }
  }
  
  // add to global scope
  if (typeof(window) !== 'undefined') {
    // browser
    window.Graph = Graph;
  } else if (typeof(require) !== 'undefined') {
    // commonjs
    exports.Graph = Graph;
  } else if (typeof(load) !== 'undefined') {
    // jsc
    return {
      "Graph": Graph
    };
  }
}());
