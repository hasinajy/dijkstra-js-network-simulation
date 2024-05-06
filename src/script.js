var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: []
});

var selectedNode = null;

cy.on('click', function (event) {
    if (event.target === cy && selectedNode === null) {
        var clickPos = event.position;
        addNode(clickPos.x, clickPos.y);
    } else {
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
    selectedNode = event.target;
    handleClick(selectedNode);
});

function handleClick(clickedNode) {
    var nodeId = clickedNode.id();
    var nodeLabel = clickedNode.data('label');

    console.log("Node clicked:", nodeId, nodeLabel);
}
