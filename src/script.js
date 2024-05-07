var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: []
});

var selectedNode = null;

cy.on('click', function (event) {
    if (event.target === cy && selectedNode === null) {
        var clickPos = event.position;
        addNode(clickPos.x, clickPos.y);
    } else if (event.target === cy) {
        selectedNode = null;
    }
});

function addNode(x, y) {
    var newNode = {
        data: { id: generateUniqueID(), label: 'New Node' },
        position: { x: x, y: y },
    };
    cy.add(newNode);
}

var nodeCounter = 0;
function generateUniqueID() {
    nodeCounter++;
    return 'node' + nodeCounter;
}

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
                    id: 'edge' + Math.random().toString(),
                    source: selectedNode.id(),
                    target: targetNode.id()
                }
            });

            console.log("Edge data:", cy.edges().last().data());
        } else {
            console.log("\nExisting edge data. Link not added.\n");
        }

        selectedNode = targetNode;
        handleClick(selectedNode);
    } else if (selectedNode == event.target) {
        console.log("\nSame node clicked. Deselecting it.\n");
        selectedNode = null;
    } else {
        selectedNode = event.target;
        handleClick(selectedNode);
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
