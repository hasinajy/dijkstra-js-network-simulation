var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: []
});

cy.on('click', function (event) {
    if (event.target === cy) {
        var clickPos = event.position;
        addNode(clickPos.x, clickPos.y);
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
    var clickedNode = event.target;
    handleClick(clickedNode);
});

function handleClick(clickedNode) {
    var nodeId = clickedNode.id();
    var nodeLabel = clickedNode.data('label');

    console.log("Node clicked:", nodeId, nodeLabel);
}
