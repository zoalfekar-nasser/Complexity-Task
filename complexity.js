const fs = require("fs");

// Utility to parse graph data from a SNAP file

// رغد محمود صبح start
function parseGraphData(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data
    .split("\n")
    .filter((line) => line && !line.startsWith("#"));
  const edges = lines.map((line) => line.split(/\s+/).map(Number));
  const vertices = new Set(edges.flat());
  return { edges, vertices: [...vertices] };
}
// رغد محمود صبح end

// Cheriyan-Mehlhorn-Gabow Algorithm for SCC

class Graph {
  // رشا منتجب سلطان start
  constructor(vertexCount) {
    this.V = vertexCount;
    this.adj = new Map();
    for (let i = 0; i < vertexCount; i++) {
      this.adj.set(i, []);
    }
  }

  addEdge(v, w) {
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(v).push(w);
  }

  SCCUtil(u, low, disc, stackMember, stack, scc, time) {
    disc[u] = low[u] = ++time.value;
    stackMember[u] = true;
    stack.push(u);

    for (let v of this.adj.get(u)) {
      if (disc[v] === -1) {
        this.SCCUtil(v, low, disc, stackMember, stack, scc, time);
        low[u] = Math.min(low[u], low[v]);
      } else if (stackMember[v]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }

    let w = 0;
    if (low[u] === disc[u]) {
      let component = [];
      while (stack[stack.length - 1] !== u) {
        w = stack.pop();
        component.push(w);
        stackMember[w] = false;
      }
      w = stack.pop();
      component.push(w);
      stackMember[w] = false;
      scc.push(component);
    }
  }
  // رشا منتجب سلطان end

  // ريم محمد جمعة start
  SCC() {
    let disc = new Array(this.V).fill(-1);
    let low = new Array(this.V).fill(-1);
    let stackMember = new Array(this.V).fill(false);
    let stack = [];
    let scc = [];
    let time = { value: 0 };

    for (let i = 0; i < this.V; i++) {
      if (disc[i] === -1) {
        this.SCCUtil(i, low, disc, stackMember, stack, scc, time);
      }
    }
    return scc;
  }
  // ريم محمد جمعة end
}

// Jens Schmidt's Algorithm for 2-Connectivity in Undirected Graph

// عمار فيصل أبو سعد start
class UndirectedGraph {
  constructor(vertexCount) {
    this.V = vertexCount;
    this.adj = new Map();
    for (let i = 0; i < vertexCount; i++) {
      this.adj.set(i, []);
    }
  }

  addEdge(v, w) {
    if (!this.adj.has(v)) this.adj.set(v, []);
    if (!this.adj.has(w)) this.adj.set(w, []);
    this.adj.get(v).push(w);
    this.adj.get(w).push(v);
  }

  is2Connected() {
    if (this.V < 2) return false;

    let disc = new Array(this.V).fill(-1);
    let low = new Array(this.V).fill(-1);
    let parent = new Array(this.V).fill(-1);
    let time = 0;
    let articulationPoints = 0;

    const DFS = (u) => {
      let children = 0;
      disc[u] = low[u] = ++time;

      for (let v of this.adj.get(u)) {
        if (disc[v] === -1) {
          children++;
          parent[v] = u;
          DFS(v);

          low[u] = Math.min(low[u], low[v]);

          if (parent[u] === -1 && children > 1) articulationPoints++;
          if (parent[u] !== -1 && low[v] >= disc[u]) articulationPoints++;
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
        }
      }
    };

    DFS(0);

    return articulationPoints === 0;
  }
}
// عمار فيصل أبو سعد end

// StronglyBiconnectedGraph Class for directed graphs

class StronglyBiconnectedGraph {
  // دعاء رسمي الجوابره start
  constructor(vertexCount) {
    this.V = vertexCount;
    this.graph = new Graph(vertexCount);
  }

  addEdge(v, w) {
    this.graph.addEdge(v, w);
  }

  isStronglyConnected() {
    const scc = this.graph.SCC();
    return scc.length === 1;
  }

  isStronglyBiconnected() {
    const scc = this.graph.SCC();
    return scc.length === 1 && scc[0].length > 2;
  }

  // دعاء رسمي الجوابره end
  // ذوالفقار محمد ناصر start
  is2VertexStronglyBiconnected() {
    if (this.V < 3) return false;

    const checkStronglyConnected = (graph) => {
      let scc = graph.SCC();
      return scc.length === 1;
    };

    for (let i = 0; i < this.V; i++) {
      let tempGraph = new Graph(this.V - 1);
      for (let v = 0; v < this.V; v++) {
        if (v === i) continue;
        for (let w of this.graph.adj.get(v)) {
          if (w !== i) tempGraph.addEdge(v < i ? v : v - 1, w < i ? w : w - 1);
        }
      }
      if (!checkStronglyConnected(tempGraph)) return false;
    }
    return true;
  }
  // ذوالفقار محمد ناصر end
}

// Helper functions to build graphs
// صبا علي أيوب start
function buildDirectedGraph(vertices, edges) {
  const graph = new StronglyBiconnectedGraph(vertices.length);
  for (let [v, w] of edges) {
    graph.addEdge(v, w);
  }
  return graph;
}

function buildUndirectedGraph(vertices, edges) {
  const graph = new UndirectedGraph(vertices.length);
  for (let [v, w] of edges) {
    graph.addEdge(v, w);
  }
  return graph;
}
// صبا علي أيوب end

// مجد فيصل سيف start
// Example usage with a SNAP formatted graph
const filePath = "graphs-for-test/Wiki-Vote.txt"; // Replace with the actual file path
const { edges, vertices } = parseGraphData(filePath);

// Assuming We know the type of graph you're working with
const isDirectedGraph = true; // Change this based on the actual graph type

if (isDirectedGraph) {
  const directedGraph = buildDirectedGraph(vertices, edges);

  console.time("Strongly Connected Check");
  console.log(
    "Is the graph strongly connected? ",
    directedGraph.isStronglyConnected()
  );
  console.timeEnd("Strongly Connected Check"); // Test the time of the function execution

  console.time("Strongly Biconnected Check");
  console.log(
    "Is the graph strongly biconnected? ",
    directedGraph.isStronglyBiconnected()
  );
  console.timeEnd("Strongly Biconnected Check");

  console.time("2-Vertex Strongly Biconnected Check");
  console.log(
    "Is the graph 2-vertex strongly biconnected? ",
    directedGraph.is2VertexStronglyBiconnected()
  );
  console.timeEnd("2-Vertex Strongly Biconnected Check");
} else {
  const undirectedGraph = buildUndirectedGraph(vertices, edges);

  console.time("2-Connected Check");
  console.log(
    "Is the undirected graph 2-connected? ",
    undirectedGraph.is2Connected()
  );
  console.timeEnd("2-Connected Check");
}

// مجد فيصل سيف end
