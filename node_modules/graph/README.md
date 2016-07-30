# GraphJS

[![Build Status](https://secure.travis-ci.org/tantalor/graphjs.png)](http://travis-ci.org/tantalor/graphjs)

**GraphJS** is a simple Javascript library for manipulating directed and undirected [graphs](http://en.wikipedia.org/wiki/Graph_\(mathematics\)).

Your graphs may have self edges, weighted edges, and directed edges, but not multiedges.

## Usage

### Creating, reading, updating, and deleting edges (CRUD)

    var g = new Graph();
    
    g.set('a', 'b', 3); # creates edge (a, b) with weight 3
    g.get('a', 'b'); # returns 3
    
    g.set('a', 'b', 4); # changes (a, b) weight to 4
    g.get('a', 'b'); # returns 4
    
    g.del('a', 'b'); # removes edge (a, b)
    g.get('a', 'b'); # returns undefined

### Constructing graphs from data

    new Graph({
      a: ['b', 'c'],
      c: ['d'],
    }); # triangle with vertices a, b, and c
    
    new Graph({
      a: {b: 2},
      b: {c: 3},
    }); # path with vertices a, b, c and weights (a, b) = 2, (b, c) = 3

#### With directed edges

    new Graph({a: ['-b', '-c']}); # Directed edges to b and c.

### Degree, size, order, and adjacency

    var g = new Graph({
      a: ['b'],
      b: ['c'],
    }); # path with vertices a, b, c
    
    g.degree('a'); # returns 1
    g.degree('b'); # returns 2
    g.degree('c'); # returns 1
    
    g.size(); # returns 2, the number of edges
    
    g.order(); # returns 3, the number of vertices
    
    for (v in g.adj('b')) {
      # v = a, c (in no particular order)
    }

### Creating directed edges

    var g = new Graph();
    g.dir('a', 'b'); # a ~ b, but b !~ a
    g.has('a', 'b'); # true
    g.has('b', 'a'); # false
    
#### Alternative syntax

    g.set('a', '-b'); # Same as g.dir('a', 'b');

### Deleting directed edges

    var g = new Graph();
    g.set('a', 'b'); # a ~ b, and b ~ a
    g.deldir('b', 'a'); # remove b ~ a
    g.has('a', 'b'); # true
    g.has('b', 'a'); # false

### Copying

    var g = new Graph({
      a: ['b', 'c'],
      c: ['d'],
    });
    
    var h = g.copy(); # an independent copy of g

## Directed edges and graph size

You may mix directed and undirected edges in the same graph.

A pair of directed edges (a, b) and (b, a) is always collapsed into an undirected edge. An undirected edge (a, b) may be expanded into a directed edge (a, b) by deleting the directed edge (b, a) with `deldir(b, a)`.

For consistency, the size of a graph is defined to be the number of undirected edges plus the number of directed edges. In other words, two distinct directed edges between two distinct vertices do not count twice for the size.

A directed self edge is indistinguishable from an undirected self edge.

## Tests

GraphJS is packaged with `nodeunit` tests.

The easiest way to run the tests is with `npm test`.

    $ npm test
    ...
    OK: 173 assertions (23ms)

You can also test your browser by loading the `test.html` page.
