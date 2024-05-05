class Node {
    constructor(ip, websites) {
        this.ip = ip;
        this.websites = websites; // array of websites
        this.connections = []; // array of connections {node: Node, latency: number}
    }
}

// Dijkstra's algorithm
function findShortestPath(startNode, website) {
    let distances = {};
    let previousNodes = {};
    let unvisitedNodes = new Set();

    // Initialization
    for (let node of allNodes) {
        distances[node.ip] = Infinity;
        previousNodes[node.ip] = null;
        unvisitedNodes.add(node);
    }
    distances[startNode.ip] = 0;

    while (unvisitedNodes.size > 0) {
        // Find the node with the smallest distance
        let currentNode = Array.from(unvisitedNodes).reduce((a, b) => distances[a.ip] < distances[b.ip] ? a : b);

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

        // Update distances to neighboring nodes
        for (let connection of currentNode.connections) {
            let altDistance = distances[currentNode.ip] + connection.latency;
            if (altDistance < distances[connection.node.ip]) {
                distances[connection.node.ip] = altDistance;
                previousNodes[connection.node.ip] = currentNode;
            }
        }
    }

    // If no path is found
    return null;
}
