var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: []
});

var nodeCounter = 0;
var edgeCounter = 0;
var selectedNode = null;
var selectedEdge = null;

cy.on('click', function (event) {
    if (canvasClicked(event) && !nodeSelected()) {
        addNode(event.position);
    } else if (canvasClicked(event)) {
        selectedNode = null;
    }
});

cy.on('click', 'node', function (event) {
    if (selectedNode != null && selectedNode != event.target) {
        var targetNode = event.target;

        console.log("\n");
        console.log("Target node selected.");
        console.log("Selected node id: " + selectedNode.id());
        console.log("Target node id: " + targetNode.id());
        console.log("\n");

        // Create edge
        if (!(isLinked(selectedNode.id(), targetNode.id()) || isLinked(targetNode.id(), selectedNode.id()))) {
            cy.add({
                data: {
                    id: 'edge' + edgeCounter,
                    source: selectedNode.id(),
                    target: targetNode.id()
                }
            });

            edgeCounter++;
            console.log("Edge data:", cy.edges().last().data());
        } else {
            console.log("\nExisting edge data. Link not added.\n");
        }

        selectedNode = targetNode;
        handleClick(selectedNode);
    } else if (selectedNode == event.target) {
        console.log("\nSame node clicked. No edge created.\n");
        selectedNode = event.target;
    } else {
        selectedNode = event.target;
        handleClick(selectedNode);
    }
});

cy.on('click', 'edge', function (event) {
    selectedNode = null;

    if (selectedEdge == event.target) {
        console.log("\nSame edge clicked. Deleting edge.");
        cy.remove(cy.edges(`[id = '${event.target.id()}']`));
        selectedEdge = null;
    } else {
        console.log("\nSelected edge: " + event.target.id());
        selectedEdge = event.target;
    }    
});

function isLinked(sourceNodeId, targetNodeId) {
    var existingEdges = cy.edges("[source='" + sourceNodeId + "'][target='" + targetNodeId + "']");
    return existingEdges.length > 0;
}

function handleClick(clickedNode) {
    var nodeId = clickedNode.id();
    var nodeLabel = clickedNode.data('label');

    console.log("\nNode clicked:", nodeId, nodeLabel);
}

// Boolean functions
function canvasClicked(event) {
    return event.target === cy;
}

function nodeSelected() {
    return !(selectedNode === null);
}

// Node
function addNode(clickPos) {
    var newNode = {
        data: { id: generateNodeID(), label: 'Default Node' },
        position: { x: clickPos.x, y: clickPos.y },
    };
    cy.add(newNode);
}

function generateNodeID() {
    nodeCounter++;
    return 'node-' + nodeCounter;
}