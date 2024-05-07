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
    if (selectedNode != null) {
        var targetNode = event.target;
        
        console.log("\n");
        console.log("Target node selected.");
        console.log("Selected node id: "+ selectedNode.id());
        console.log("Target node id: "+ targetNode.id());
        console.log("\n");

        // Create edge
        cy.add({
            id: 'edge' + Math.random().toString(),
            source: selectedNode.id(),
            target: targetNode.id(),
            'line-color': '#ccc',  // Example style property
        });
        
        console.log("Edge data:", cy.edges().last().data());

        selectedNode = targetNode;
        handleClick(selectedNode);
    } else {
        selectedNode = event.target;
        handleClick(selectedNode);
    }
});

function handleClick(clickedNode) {
    var nodeId = clickedNode.id();
    var nodeLabel = clickedNode.data('label');

    console.log("Node clicked:", nodeId, nodeLabel);
}
