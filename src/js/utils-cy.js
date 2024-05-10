/* -------------------------------------------------------------------------- */
/*                            cy related functions                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Conditionnals ----------------------------- */
// Checks if the clicked area is inside the canvas
function canvasClicked(mouseEvent) {
    return mouseEvent.target === cy;
}

// Checks if the canvas has an element with the class highlight
function hasHighlighted() {
    return !hasNoClass("highlight");
}

function hasNoClass(className) {
    return cy.elements().every(function (element) {
        return !element.hasClass(className);
    });
}

function hasBfs() {
    return !hasNoClass("bfs");
}

/* --------------------------------- Others --------------------------------- */
function deselectAll() {
    selectedServer = null;
    selectedEdge = null;
    cy.elements().removeClass('highlight');
    cy.elements().removeClass('bfs');
}


/* -------------------------------------------------------------------------- */
/*                           Server related functions                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Conditionals ------------------------------ */
// Checks if any server is selected
function hasServerSelected() {
    return selectedServer != null;
}

// Checks if a 2nd server is selected
function hasTargetServerSelected(mouseEvent) {
    return selectedServer != mouseEvent.target;
}

// Checks if 2 servers are linked
function isLinked(srcServer, targetServer) {
    var edges = cy.edges("[source='" + srcServer.id() + "'][target='" + targetServer.id() + "']")
        .union(cy.edges("[source='" + targetServer.id() + "'][target='" + srcServer.id() + "']"));
    return edges.length > 0;
}

/* --------------------------------- Others --------------------------------- */
function createServer(clickPos) {
    const IPAdress = addNode(clickPos);
    addServer(IPAdress);
}

function addNode(clickPos) {
    const IPAdress = generateRandomIP();

    cy.add({
        data: { id: generateNodeID(), label: IPAdress },
        position: { x: clickPos.x, y: clickPos.y },
        hostedWebsites: []
    });

    return IPAdress;
}

function addServer(IPAdress) {
    dijkstraServers.push({
        ip: IPAdress,
        state: 'on',
        websites: [],
        connections: []
    });
}

function generateNodeID() {
    nodeCounter++;
    return 'node-' + nodeCounter;
}

function updateServerInformationDisplay() {
    createServerInformation("server-info");
    document.getElementById("server-ip").value = selectedServer.data('label');
}

function deleteSelectedServer() {
    cy.remove(`node[id = '${selectedServer.id()}']`);

    dijkstraServers = dijkstraServers.filter((server) => {
        return server.ip != selectedServer.data('label');
    });

    selectedServer = null;
    createNoInformation("server-info");
}

function updateDijkstraServer() {
    dijkstra = dijkstraServers.filter((server) => {
        return server.ip == selectedServer.data('label');
    })[0];
}

function highlightServer(server) {
    cy.nodes(`[label='${server.ip}']`).addClass("highlight");
    cy.style().update();
}

function bfsHighlightServer(server) {
    cy.nodes(`[label='${server.ip}']`).addClass("bfs");
    cy.style().update();
}

// CLICK: Update server
function updateSelectedServerData() {
    const IPAdress = document.getElementById("server-ip").value;
    const serverState = (document.getElementById("server-state").checked) ? "on" : "off";
    const websiteList = getHostedWebsites();

    updateServerIP(IPAdress);
    updateServerState(IPAdress, serverState);
    updateHostedWebsites(IPAdress, websiteList);
}

function getHostedWebsites() {
    var ulElement = document.getElementById("website-list");
    var listItems = ulElement.getElementsByTagName('li');
    var contents = [];

    for (var i = 0; i < listItems.length - 1; i++) {
        contents.push(listItems[i].textContent);
    }

    return contents;
}

function updateServerIP(IPAdress) {
    const oldIP = selectedServer.data('label');

    // Update IP in cy geometry
    selectedServer.data('label', IPAdress);
    cy.style().update();

    // Update IP in dijkstra servers
    const srcServer = dijkstraServers.filter((server) => {
        return server.ip == oldIP;
    })[0];

    srcServer.ip = IPAdress;

    // Update IP in server links
    replaceIP(serverLinks, oldIP, IPAdress);
}

function updateServerState(IPAdress, serverState) {
    const srcServer = dijkstraServers.filter((server) => {
        return server.ip == IPAdress;
    })[0];

    srcServer.state = serverState;
}

function updateHostedWebsites(IPAdress, websiteList) {
    const server = dijkstraServers.filter((server) => {
        return server.ip == IPAdress;
    })[0];

    server.websites = websiteList;
}

/* -------------------------------------------------------------------------- */
/*                           Edge related functions                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Conditionals ------------------------------ */
// Checks if any edge is selected
function hasSelectedEdge() {
    return selectedEdge != null;
}

// Checks if an edge is selected twice
function isSelectedEdge(edge) {
    return selectedEdge == edge;
}

/* --------------------------------- Others --------------------------------- */
// Add edge
function createEdge(srcNode, targetNode) {
    const edgeID = addEdge(srcNode.id(), targetNode.id());
    addLink(srcNode.data('label'), targetNode.data('label'), edgeID);
}

function addEdge(srcID, targetID) {
    const edgeID = generateEdgeID();

    cy.add({
        data: {
            id: edgeID,
            source: srcID,
            target: targetID,
            weight: defaultLatency
        }
    });

    return edgeID;
}

function addLink(srcIP, targetIP, edgeID) {
    serverLinks.push({
        id: edgeID,
        srcIP: srcIP,
        targetIP: targetIP
    });

    const srcServer = getServer(srcIP);
    const targetServer = getServer(targetIP);

    srcServer.connections.push({
        node: targetServer,
        latency: defaultLatency,
        edgeID: edgeID
    });

    targetServer.connections.push({
        node: srcServer,
        latency: defaultLatency,
        edgeID: edgeID
    });
}

// Remove edge
function removeEdge(edgeID) {
    cy.remove(cy.edges(`[id = '${edgeID}']`));

    // Get the link data from the list
    const link = serverLinks.filter((link) => {
        return link.id == edgeID;
    })[0];

    // Remove the link data from the list
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

// Others
function getServer(IPAdress) {
    return dijkstraServers.filter((server) => {
        return server.ip == IPAdress;
    })[0];
}

function generateEdgeID() {
    edgeCounter++;
    return 'edge-' + edgeCounter;
}

function updateSelectedEdge() {
    const latencyValue = parseInt(document.getElementById("latency").value);

    if (latencyValue !== null && latencyValue !== undefined != "") {
        selectedEdge.data("weight", latencyValue);

        cy.style().selector('edge').style().update();

        updateLinks(latencyValue);
    }
}

function updateLinks(latency) {
    const srcServer = dijkstraServers.filter((server) => {
        return server.ip == selectedEdge.source().data('label');
    })[0];

    const targetServer = dijkstraServers.filter((server) => {
        return server.ip == selectedEdge.target().data('label');
    })[0];

    srcServer.connections.forEach(server => {
        if (server.node.ip == targetServer.ip) {
            server.latency = latency;
        }
    });

    targetServer.connections.forEach(server => {
        if (server.node.ip == srcServer.ip) {
            server.latency = latency;
        }
    });
}

function highlightEdge(server, linkedServer) {
    const edgeID = getEdgeID(server, linkedServer);
    cy.edges(`#${edgeID}`).addClass("highlight");
    cy.style().update();
}

function bfsHighlightEdge(server, linkedServer) {
    const edgeID = getEdgeID(server, linkedServer);
    cy.edges(`#${edgeID}`).addClass("bfs");
    cy.style().update();
}

function getEdgeID(server, linkedServer) {
    return server.connections.filter((connection) => {
        return connection.node.ip == linkedServer.ip;
    })[0].edgeID;
}