if (typeof(require) !== 'undefined') {
  // commonjs
  var Graph = require("../lib/graph").Graph;
} else if (typeof(load) !== 'undefined') {
  // jsc
  var Graph = load("lib/graph.js").Graph;
}

this.core_suite =
{
  'Graph exists': function (test)
  {
    test.ok(Graph,
      "I can find the Graph class.");
    test.done();
  },

  'Null get': function (test)
  {
    var g = new Graph();
    test.ok(g.get(1, 2) === undefined,
      "Get for unknown edge returns undef.");
    test.ok(g.has(1, 2) === false,
      "Has for unknown edge returns false.");
    test.done();
  },

  'Bad delete': function (test)
  {
    var g = new Graph();
    g.del(1, 2);
    test.ok(g.degree(1) === 0,
      "Degree of one vertex is 0.");
    test.ok(g.degree(2) === 0,
      "Degree of other vertex is 0.");
    test.ok(g.size() === 0,
      "Size is 0.");
    test.done();
  },

  'Simple get': function (test)
  {
    var g = new Graph();
    test.ok(g.set(1, 2, 3) === 3,
      "Set returns edge weight.");
    test.ok(g.get(1, 2) === 3,
      "Get returns edge weight.");
    test.done();
  },

  'Set and get': function (test)
  {
    var g = new Graph();
    g.set(1, 2, 3);
    test.ok(g.get(1, 2) === 3,
      "Get with original order returns weight.");
    test.ok(g.get(2, 1) === 3,
      "Get with reveresed order returns weight.");
    test.ok(g.order() === 2,
      "Number of vertices is 2.");
    test.ok(g.degree(1) === 1,
      "Degree of one vertex is 1.");
    test.ok(g.degree(2) === 1,
      "Degree of other vertex is 1.");
    test.ok(g.size() === 1,
      "Size is 1.");
    test.done();
  },

  'Set and delete': function (test)
  {
    var g = new Graph();
    test.ok(g.set(1, 2),
      "Added edge.")
    test.ok(g.del(1, 2) === false,
      "Deleted edge.")
    test.ok(!g.has(1, 2),
      "Deleted edge doesn't exist.");
    test.ok(!g.has(2, 1),
      "Reverse of edge also doesn't exist.");
    test.ok(g.order() === 2,
      "Number of vertices is 2.");
    test.ok(g.degree(1) === 0,
      "Degree of one vertex is 0.");
    test.ok(g.degree(2) === 0,
      "Degree of other vertex is 0.");
    test.ok(g.size() === 0,
      "Size is 0.");
    test.done();
  },

  'Set and reverse set': function (test)
  {
    var g = new Graph();
    g.set(1, 2, 3);
    g.set(2, 1, 4);
    test.ok(g.get(1, 2) === 4,
      "Get with original order returns new weight.");
    test.ok(g.get(2, 1) === 4,
      "Get with reversed order returns new weight.");
    test.ok(g.order() === 2,
      "Number of vertices is 2.");
    test.ok(g.degree(1) === 1,
      "Degree of one vertex is 1.");
    test.ok(g.degree(2) === 1,
      "Degree of other vertex is 1.");
    test.ok(g.size() === 1,
      "Size is 1.");
    test.done();
  },

  'Set and reverse delete': function (test)
  {
    var g = new Graph();
    test.ok(g.set(1, 2),
      "Added edge.")
    test.ok(g.del(2, 1) === false,
      "Deleted edge.");
    test.ok(!g.has(1, 2),
      "Deleted edge doesn't exist.");
    test.ok(!g.has(2, 1),
      "Reverse of edge also doesn't exist.");
    test.ok(g.order() === 2,
      "Number of vertices is 2.");
    test.ok(g.degree(1) === 0,
      "Degree of one vertex is 0.");
    test.ok(g.degree(2) === 0,
      "Degree of other vertex is 0.");
    test.ok(g.size() === 0,
      "Size is 0.");
    test.done();
  },

  'Self edge': function (test)
  {
    var g = new Graph();
    test.ok(g.set(1, 1, 2) == 2,
      "Set self edge returns weight.");
    test.ok(g.get(1, 1) === 2,
      "Get self edge returns weight.");
    test.ok(g.order() === 1,
      "Number of vertices is 1.");
    test.ok(g.degree(1) === 1,
      "Degree of vertex is 1.");
    test.ok(g.size() === 1,
      "Size is 1.");
    test.done();
  },

  'Simple constructor': function (test)
  {
    var g = new Graph({pirate: ['ninja', 'robot']});
    test.ok(g.get('pirate', 'ninja') && g.get('pirate', 'robot'),
      "All edges exist.");
    test.ok(g.order() === 3,
      "Number of vertices is 3.");
    test.ok(g.degree('pirate') === 2,
      "Degree of 'pirate' vertex is 2.");
    test.ok(g.degree('ninja') === 1,
      "Degree of 'ninja' vertex is 1.");
    test.ok(g.degree('robot') === 1,
      "Degree of 'robot' vertex is 1.");
    test.ok(g.size() === 2,
      "Size is 2.");
    test.done();
  },

  'Constructor with weights': function (test)
  {
    var g = new Graph({pirate: {ninja: 'robot'}});
    test.ok(g.get('pirate', 'ninja') === 'robot',
      "Get in original order has weight 'robot'.");
    test.ok(g.get('ninja', 'pirate') === 'robot',
      "Get in reversed order has weight 'robot'.");
    test.ok(g.order() === 2,
      "Number of vertices is 2.");
    test.ok(g.degree('pirate') === 1,
      "Degree of 'pirate' vertex is 1.");
    test.ok(g.degree('ninja') === 1,
      "Degree of 'ninja' vertex is 1.");
    test.ok(g.size() === 1,
      "Size is 1.");
    test.done();
  },

  'Constructor with directed edges': function (test)
  {
    var g = new Graph({'a': ['-b', '-c']});
    test.ok(g.order() === 3,
      "Number of vertices is 3.");
    test.ok(g.size() === 2,
      "Number of edges is 2.");
    test.ok(g.degree('a') === 2,
      "Out degree of 'a' is 1.");
    test.ok(g.degree('b') === 0,
      "Out degree of 'b' is 0.");
    test.ok(g.degree('c') === 0,
      "Out degree of 'c' is 0.");
    test.ok(g.indegree('a') === 0,
      "In degree of 'a' is 0.");
    test.ok(g.indegree('b') === 1,
      "In degree of 'b' is 1.");
    test.ok(g.indegree('c') === 1,
      "In degree of 'c' is 1.");
    test.ok(g.has('a', 'b'));
    test.ok(g.has('a', 'c'));
    test.ok(!g.has('b', 'a'));
    test.ok(!g.has('c', 'a'));
    test.ok(!g.has('c', 'b'));
    test.ok(!g.has('b', 'c'));
    test.done();
  },

  'Multiget': function (test)
  {
    var g = new Graph();
    test.ok(g.set(1, 2) && g.set(2, 3) && g.set(3, 1),
      "Set all edges.");
    test.ok(g.get(2, 1) && g.get(3, 2) && g.get(1, 3),
      "All edges exist.");
    test.ok(g.degree(1) == 2 && g.degree(2) == 2 && g.degree(3) == 2,
      "Degree of all vertices is 2.");
    test.ok(g.order() === 3,
      "Number of vertices is 3.");
    test.ok(g.size() === 3,
      "Size is 3.");
    test.done();
  },

  'Adjacency': function (test)
  {
    var g = new Graph();
    g.set(1, 2);
    test.ok(1 in g.adj(2),
      "Vertex 1 is adjacent to vertex 2.");
    test.ok(2 in g.adj(1),
      "Vertex 2 is adjacent to vertex 1.");
    test.done();
  },
  
  'Depth-first search': function (test)
  {
    var g = new Graph({
      1: [2, 3],
      2: [4, 5],
      3: [6, 7],
    });
    var visited = {};
    function visit (v)
    {
      if (visited[v]) return;
      visited[v] = 1;
      for (var u in g.adj(v)) {
        visit(u);
      };
    }
    visit(1);
    test.ok(visited[1], "Visited vertex 1.");
    test.ok(visited[2], "Visited vertex 2.");
    test.ok(visited[3], "Visited vertex 3.");
    test.ok(visited[4], "Visited vertex 4.");
    test.ok(visited[5], "Visited vertex 5.");
    test.ok(visited[6], "Visited vertex 6.");
    test.ok(visited[7], "Visited vertex 7.");
    test.done();
  },
  
  'Breadth-first search': function (test)
  {
    var g = new Graph({
      1: [2, 3],
      2: [4, 5],
      3: [6, 7],
    });
    var fringe = [1];
    var visited = {};
    while (fringe.length > 0)
    {
      var v = fringe.shift();
      if (visited[v]) continue;
      visited[v] = 1;
      for (var u in g.adj(v)) {
        fringe.push(u);
      };
    }
    test.ok(visited[1], "Visited vertex 1.");
    test.ok(visited[2], "Visited vertex 2.");
    test.ok(visited[3], "Visited vertex 3.");
    test.ok(visited[4], "Visited vertex 4.");
    test.ok(visited[5], "Visited vertex 5.");
    test.ok(visited[6], "Visited vertex 6.");
    test.ok(visited[7], "Visited vertex 7.");
    test.done();
  },
  
  'Simple copy': function (test)
  {
    var g = new Graph({
      1: [2, 3],
      2: [3],
    });
    var h = g.copy();
    test.ok(g.get(2, 3),
      "Original graph has edge.")
    test.ok(g.del(2, 3) === false,
      "Deleted edge in original graph.");
    test.ok(!g.has(2, 3),
      "Original graph does not have deleted edge.")
    test.ok(h.get(2, 3),
      "Copied graph has deleted edge.");
    test.ok(g.size() == 2,
      "Original graph has size 2.");
    test.ok(h.size() == 3,
      "Copied graph has size 3.");
    test.ok(g.degree(2) == 1,
      "Degree of vertex 1 in original is 1.")
    test.ok(h.degree(2) == 2,
      "Degree of vertex 1 in copy is 2.")
    test.done();
  },
  
  'Copy with weights': function (test)
  {
    var g = new Graph({
      1: {2: 3},
    });
    var h = g.copy();
    test.ok(g.get(1, 2) === 3,
      "Original graph has edge with weight.")
    test.ok(g.del(1, 2) === false,
      "Deleted edge in original graph.");
    test.ok(!g.has(1, 2),
      "Original graph does not have deleted edge.")
    test.ok(h.get(1, 2) == 3,
      "Copied graph has deleted edge with weight.");
    test.done();
  },
  
  'Repeated vertices': function (test)
  {
    var g = new Graph();
    g.set('a', 'b');
    g.del('a', 'b');
    g.set('a', 'b');
    
    test.ok(g.order() === 2,
      "Graph has 2 vertices.");
    test.done();
  },
  
  'Add falsey weight': function (test)
  {
    var g = new Graph();
    g.set('a', 'b', 0);
    
    test.ok(g.size() === 1,
      "Graph has 1 edge.");
    test.done();
  },
  
  'Remove falsey weight': function (test)
  {
    var g = new Graph();
    g.set('a', 'b', 0);
    g.del('a', 'b');
    
    test.ok(g.size() === 0,
      "Graph has 0 edges.");
    test.done();
  },
  
  'Add directed edges': function (test)
  {
    var g = new Graph();
    g.dir(1, 2);
    
    test.ok(g.order() === 2,
      "Order is 2.");
    
    test.ok(g.size() === 1,
      "Size is 1.");
    
    test.ok(g.has(1, 2),
      "1 ~ 2");
    
    test.ok(!g.has(2, 1),
      "2 !~ 1");
    
    test.ok(g.degree(1) === 1,
      "Out degrees of 1 is 1.");
    
    test.ok(g.degree(2) === 0,
      "Out degrees of 2 is 0.");
    
    test.ok(g.indegree(1) === 0,
      "Out degrees of 1 is 0.");
    
    test.ok(g.indegree(2) === 1,
      "Out degrees of 2 is 1.");
    test.done();
  },
  
  'Remove directed edges': function (test)
  {
    var g = new Graph();
    g.set(1, 2);
    g.deldir(2, 1);
    
    test.ok(g.order() === 2,
      "Order is 2.");
    
    test.ok(g.size() === 1,
      "Size is 1.");
    
    test.ok(g.has(1, 2),
      "1 ~ 2");
    
    test.ok(!g.has(2, 1),
      "2 !~ 1");
    
    test.ok(g.degree(1) === 1,
      "Out degrees of 1 is 1.");
    
    test.ok(g.degree(2) === 0,
      "Out degrees of 2 is 0.");
    
    test.ok(g.indegree(1) === 0,
      "Out degrees of 1 is 0.");
    
    test.ok(g.indegree(2) === 1,
      "Out degrees of 2 is 1.");
    test.done();
  },
  
  'Double directed edges': function (test)
  {
    var g = new Graph();
    g.dir(1, 2);
    g.dir(2, 1);
    
    test.ok(g.order() === 2,
      "Order is 2.");
    
    test.ok(g.size() === 1,
      "Size is 1.");
    
    test.ok(g.has(1, 2) && g.has(2, 1),
      "1 ~ 2 and 2 ~ 1");
    test.done();
  },
  
  'Drop vertex': function (test)
  {
    // var g = Graph.k(4, ['a', 'b', 'c', 'd']);
    var g = new Graph({
      a: ['b', 'c', 'd'],
      b: ['c', 'd'],
      c: ['d'],
    });
    test.ok(!g.drop('z'),
      "Can't drop a vertex that isn't in the graph.")
    test.ok(g.size() === 6 && g.order() === 4,
      "Graph is K(4).");
    test.ok(g.drop('a'),
      "Dropped a vertex.");
    test.ok(g.size() === 3 && g.order() === 3,
      "K(4) is now K(3).")
    test.ok(g.del('b'),
      "Dropped another vertex.");
    test.ok(g.size() === 1 && g.order() === 2,
      "K(3) is now K(2).");
    test.done();
  }
};
