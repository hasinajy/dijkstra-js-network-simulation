function runSimulation() {
  const url = document.getElementById("url").value;

  if (dijkstra != null && dijkstra != undefined && url != "") {
    console.log("Running simulation ...");

    const path = findShortestPath(dijkstra, url);
    console.log(path);

    for (let i = 0; i < path.length - 1; i++) {
      highlightServer(path[i]);
      highlightEdge(path[i], path[i + 1]);
    }

    highlightServer(path[path.length - 1]);

    const bfsPath = findShortestPathBFS(dijkstra, url);
    console.log(bfsPath);

    for (let i = 0; i < bfsPath.length - 1; i++) {
      bfsHighlightServer(bfsPath[i]);
      bfsHighlightEdge(bfsPath[i], bfsPath[i + 1]);
    }

    bfsHighlightServer(bfsPath[bfsPath.length - 1]);
  }
}

// Dijkstra's algorithm with state check
function findShortestPath(startNode, website) {
  let distances = {};
  let previousNodes = {};
  let unvisitedNodes = new Set();

  // Initialization
  for (let node of dijkstraServers) {
    distances[node.ip] = Infinity;
    previousNodes[node.ip] = null;
    unvisitedNodes.add(node);
  }
  distances[startNode.ip] = 0;

  while (unvisitedNodes.size > 0) {
    // Find the node with the smallest distance among available (state: on) nodes
    let currentNode = Array.from(unvisitedNodes)
      .filter(node => node.state === 'on') // Filter based on state
      .reduce((a, b) => distances[a.ip] < distances[b.ip] ? a : b);

    // If no available (state: on) node is found, exit
    if (!currentNode) {
      return null;
    }

    // If the current node hosts the website, we have found our path
    if (currentNode.websites.includes(website)) {
      let path = [];
      while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode.ip];
      }
      return path;
    }

    unvisitedNodes.delete(currentNode);

    // Update distances to neighboring nodes (state: on)
    for (let connection of currentNode.connections) {
      if (connection.node.state === 'on') { // Check neighbor state
        let altDistance = distances[currentNode.ip] + connection.latency;
        if (altDistance < distances[connection.node.ip]) {
          distances[connection.node.ip] = altDistance;
          previousNodes[connection.node.ip] = currentNode;
        }
      }
    }
  }

  // If no path is found
  return null;
}

// BFS algorithm  with state check
function findShortestPathBFS(startNode, website) {
  let visitedNodes = new Set();
  let queue = [];
  let previousNodes = {};

  // Initialization
  queue.push(startNode);
  previousNodes[startNode.ip] = null;

  while (queue.length > 0) {
    let currentNode = queue.shift();

    // If the current node hosts the website, we have found our path
    if (currentNode.websites.includes(website)) {
      let path = [];
      while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode.ip];
      }
      return path;
    }

    visitedNodes.add(currentNode);

    // Add neighboring nodes (state: on) to the queue
    for (let connection of currentNode.connections) {
      if (connection.node.state === 'on' && !visitedNodes.has(connection.node)) { // Check neighbor state
        queue.push(connection.node);
        if (!previousNodes[connection.node.ip]) {
          previousNodes[connection.node.ip] = currentNode;
        }
      }
    }
  }

  // If no path is found
  return null;
}