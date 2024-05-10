// Create a new node
cy.on('click', function (event) {
    if (canvasClicked(event) && !hasServerSelected() && !hasSelectedEdge() && !hasHighlighted() && !hasBfs()) {
        createServer(event.position);
    } else if (canvasClicked(event)) {
        deselectAll();
        updateUI();
    }
});

// Create a link bewteen nodes
cy.on('click', 'node', function (event) {
    if (hasServerSelected() && hasTargetServerSelected(event)) {
        var targetServer = event.target;

        console.log("==== NEW EDGE ====");
        console.log("Target node selected.");
        console.log("Source id: " + selectedServer.id());
        console.log("Target id: " + targetServer.id());

        // Create edge geometry
        if (!isLinked(selectedServer, targetServer)) {
            createEdge(selectedServer, targetServer);
        } else {
            console.log(">>> Existing edge data. Link not added.");
        }
    } else if (selectedServer == event.target) {
        console.log(">>> Same node. Edge not created.");
    }

    selectedServer = event.target;
    console.log("\n");

    updateDijkstraServer();
    updateServerInformationDisplay();
});

// Select & delete edges
cy.on('click', 'edge', function (event) {
    selectedServer = null;

    if (isSelectedEdge(event.target)) {
        removeEdge(event.target.id());

        console.log(">>> Same edge. Edge deleted.");
        console.log("\n");
    }

    selectedEdge = (isSelectedEdge(event.target)) ? null : event.target;

    updateLatencyDisplay();
});

function updateUI() {
    createNoInformation("server-info");
    updateLatencyDisplay();
}

function updateLatencyDisplay() {
    const latencyField = document.getElementById("latency");
    latencyField.value = (selectedEdge == null) ? 0 : selectedEdge.data('weight');
}