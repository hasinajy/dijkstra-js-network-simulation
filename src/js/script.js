var cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
        {
            selector: 'edge',
            style: {
                width: 2,
                targetArrowShape: 'triangle',

                label: 'data(weight)'
            }
        },
        {
            selector: 'edge:selected',
            style: {
                lineColor: '#6c6ce7'
            }
        },
        {
            selector: 'edge:unselected',
            style: {
                lineColor: '#ccc'
            }
        },
        {
            selector: 'edge:highlight',
            style: {
                backgroundColor: 'rgb(160, 200, 160)'
            }
        },
        {
            selector: 'node',
            style: {
                padding: 10,

                label: 'data(label)',
                color: 'black',
                fontSize: 16
            }
        },
        {
            selector: 'node:selected',
            style: {
                backgroundColor: '#6c6ce7'
            }
        },
        {
            selector: 'node:unselected',
            style: {
                backgroundColor: 'rgb(160, 160, 180)'
            }
        },
        {
            selector: 'node:highlight',
            style: {
                backgroundColor: 'rgb(160, 200, 160)'
            }
        }
    ],
    elements: []
});

// Create a new node
cy.on('click', function (event) {
    if (canvasClicked(event) && !nodeSelected() && !edgeSelected()) {
        addNode(event.position);
    } else if (canvasClicked(event)) {
        selectedNode = null;
        selectedEdge = null;
        createNoInformation("server-info");
        displayEdgeData();
    }
});

// Create a link bewteen nodes
cy.on('click', 'node', function (event) {
    if (nodeSelected() && targetNodeSelected(event.target)) {
        var targetNode = event.target;

        console.log("==== NEW EDGE ====");
        console.log("Target node selected.");
        console.log("Source id: " + selectedNode.id());
        console.log("Target id: " + targetNode.id());

        // Create edge geometry
        if (!isLinked(selectedNode, targetNode)) {
            addEdge(selectedNode, targetNode);
        } else {
            console.log(">>> Existing edge data. Link not added.");
        }
    } else if (selectedNode == event.target) {
        console.log(">>> Same node. Edge not created.");
    }

    selectedNode = event.target;
    console.log("\n");

    dijkstra = dijkstraServers.filter((server) => {
        return server.ip == selectedNode.data('label');
    })[0];

    displayNodeContent();
});

// Select & delete edges
cy.on('click', 'edge', function (event) {
    selectedNode = null;

    if (isSelectedEdge(event.target)) {
        removeLink(event.target.id());

        console.log(">>> Same edge. Edge deleted.");
        console.log("\n");
    }

    selectedEdge = (isSelectedEdge(event.target)) ? null : event.target;

    displayEdgeData();
});

function displayEdgeData() {
    const latencyField = document.getElementById("latency");
    latencyField.value = (selectedEdge == null) ? 0 : selectedEdge._private.data.weight;
}

// Boolean functions
function canvasClicked(event) {
    return event.target === cy;
}

function nodeSelected() {
    return !(selectedNode === null);
}

function edgeSelected() {
    return !(selectedEdge === null);
}

function targetNodeSelected(node) {
    return selectedNode != node;
}

function isLinked(sourceNode, targetNode) {
    var edges = cy.edges("[source='" + sourceNode.id() + "'][target='" + targetNode.id() + "']")
        .union(cy.edges("[source='" + targetNode.id() + "'][target='" + sourceNode.id() + "']"));
    return edges.length > 0;
}

function isSelectedEdge(edge) {
    return selectedEdge == edge;
}

// Node
function addNode(clickPos) {
    var newNode = {
        data: { id: generateNodeID(), label: generateRandomIP() },
        position: { x: clickPos.x, y: clickPos.y },
        hostedWebsites: []
    };

    cy.add(newNode);
    dijkstraServers.push({
        ip: newNode.data.label,
        websites: [],
        connections: []
    });
}

function generateNodeID() {
    nodeCounter++;
    return 'node-' + nodeCounter;
}

function displayNodeContent() {
    createServerInformation("server-info");
    document.getElementById("server-ip").value = selectedNode._private.data.label;
}

function deleteSelectedNode() {
    cy.remove(`node[id = '${selectedNode.id()}']`);

    nodes = nodes.filter((server) => {
        return server.data.id != selectedNode.id();
    });

    selectedNode = null;
    createNoInformation("server-info");
}

function generateRandomIP() {
    // Define valid IP address component range (1-255)
    const max = 255;
    const min = 1;

    // Generate random octets (parts) of the IP address
    var octet1 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet2 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet3 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet4 = Math.floor(Math.random() * (max - min + 1)) + min;

    // Return the formatted IP address
    return octet1 + "." + octet2 + "." + octet3 + "." + octet4;
}

// Edge
function addEdge(srcNode, targetNode) {
    const edge = {
        data: {
            id: generateEdgeID(),
            source: srcNode.id(),
            target: targetNode.id(),
            weight: 10
        }
    }

    cy.add(edge);

    serverLinks.push({
        id: edge.data.id,
        srcIP: srcNode.data('label'),
        targetIP: targetNode.data('label')
    });

    linkServer(srcNode.data('label'), targetNode.data('label'), edge.data.weight, edge.data.id);
}

function linkServer(srcIP, targetIP, latency, edgeID) {
    const srcServer = getServer(srcIP);
    const targetServer = getServer(targetIP);

    srcServer.connections.push({
        node: targetServer,
        latency: latency,
        edgeID: edgeID
    });

    targetServer.connections.push({
        node: srcServer,
        latency: latency,
        edgeID: edgeID
    });
}

function removeLink(edgeID) {
    cy.remove(cy.edges(`[id = '${edgeID}']`));

    const link = serverLinks.filter((link) => {
        return link.id == edgeID;
    })[0];

    serverLinks = serverLinks.filter((link) => {
        return link.id != edgeID;
    });

    unlinkServer(link.srcIP, link.targetIP);
}

function unlinkServer(srcIP, targetIP) {
    const srcServer = getServer(srcIP);
    const targetServer = getServer(targetIP);

    srcServer.connections = srcServer.connections.filter((connection) => {
        return connection.node.ip != targetIP;
    });

    targetServer.connections = targetServer.connections.filter((connection) => {
        return connection.node.ip != srcIP;
    });
}

function getServer(IP) {
    return dijkstraServers.filter((server) => {
        return server.ip == IP;
    })[0];
}

function generateEdgeID() {
    edgeCounter++;
    return 'edge-' + edgeCounter;
}