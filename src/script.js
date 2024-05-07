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

// Boolean functions
function canvasClicked(event) {
    return event.target === cy;
}

function nodeSelected() {
    return !(selectedNode === null);
}

function targetNodeSelected(node) {
    return selectedNode != node;
}

function isLinked(sourceNode, targetNode) {
    var edges = cy.edges("[source='" + sourceNode.id() + "'][target='" + targetNode.id() + "']")
        .union(cy.edges("[source='" + targetNode.id() + "'][target='" + sourceNode.id() + "']"));
    return edges.length > 0;
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

// Edge
function addEdge(srcNode, targetNode) {
    cy.add({
        data: {
            id: generateEdgeID(),
            source: srcNode.id(),
            target: targetNode.id()
        }
    });
}

function generateEdgeID() {
    edgeCounter++;
    return 'edge-' + edgeCounter;
}