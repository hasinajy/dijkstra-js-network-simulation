function createServerInformation(containerId) {
    // Get the container element
    var container = document.getElementById(containerId);
    if (!container) {
        console.error("Container element with ID", containerId, "not found.");
        return;
    }

    container.innerHTML = "";

    // Create the elements
    var h1 = document.createElement('h1');
    h1.classList.add('section-title');
    h1.textContent = 'Server information';

    var formControl = document.createElement('div');
    formControl.classList.add('form__control', 'server-ip');

    var label = document.createElement('label');
    label.htmlFor = 'server-ip';
    var labelText = document.createElement('b');
    labelText.textContent = 'Server IP:';
    label.appendChild(labelText);

    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'server-ip';
    input.value = '192.168.17.16';
    input.id = 'server-ip';

    var hostedWebsites = document.createElement('div');
    hostedWebsites.classList.add('hosted-websites');

    var hostedWebsitesTitle = document.createElement('p'); 
    labelText.textContent = "Hosted websites:"
    hostedWebsitesTitle.appendChild(labelText);

    var websiteList = document.createElement('ul');
    websiteList.id = 'website-list';

    const server = dijkstraServers.filter((server) => {
        return server.ip == selectedNode.data('label');
    })[0];

    if (server !== undefined && server !== null && server.websites.length != 0) {
        server.websites.forEach((site) => {
            var website = document.createElement('li');
            website.textContent = site;
            websiteList.appendChild(website);
        });
    }

    var websiteListItem = document.createElement('li');
    websiteListItem.id = 'website-cta';

    var addWebsiteSpan = document.createElement('span');
    addWebsiteSpan.classList.add('fa', 'fa-add', 'btn');
    addWebsiteSpan.id = 'add-website';

    var websiteInput = document.createElement('input');
    websiteInput.type = 'text';
    websiteInput.name = 'website';
    websiteInput.id = 'website-field';
    websiteInput.placeholder = 'Add a new website ...';

    var infoButtonGroup = document.createElement('div');
    infoButtonGroup.id = 'info-btn-group';

    var removeServerSpan = document.createElement('span');
    removeServerSpan.classList.add('fa', 'fa-trash', 'server-btn', 'btn');
    removeServerSpan.id = 'remove-server';

    var updateServerSpan = document.createElement('span');
    updateServerSpan.classList.add('server-btn', 'btn');
    updateServerSpan.id = "update-server";
    updateServerSpan.textContent = 'Update server data';

    // Nest elements
    websiteListItem.appendChild(addWebsiteSpan);
    websiteListItem.appendChild(websiteInput);
    websiteList.appendChild(websiteListItem);
    hostedWebsites.appendChild(hostedWebsitesTitle);
    hostedWebsites.appendChild(websiteList);
    infoButtonGroup.appendChild(removeServerSpan);
    infoButtonGroup.appendChild(updateServerSpan);
    formControl.appendChild(label);
    formControl.appendChild(input);
    container.appendChild(h1);
    container.appendChild(formControl);
    container.appendChild(hostedWebsites);
    container.appendChild(infoButtonGroup);

    var addWebsite = document.getElementById("add-website");
    addWebsite.addEventListener("click", (event) => {
        var websiteValue = document.getElementById("website-field").value;

        if (validWebsite(websiteValue)) {
            appendWebsite(websiteValue);
        }
    });

    var deleteBtn = document.getElementById("remove-server");
    deleteBtn.addEventListener("click", () => {
        deleteSelectedNode();
    });

    var updateServer = document.getElementById("update-server");
    updateServer.addEventListener("click", () => {
        updateSelectedServer();
    });
}

function updateSelectedServer() {
    const IPAdress = document.getElementById("server-ip").value;
    const websiteList = getListContents("website-list");

    updateServerIP(IPAdress);
    updateServerWebsites(IPAdress, websiteList);
}

function getListContents(ulElementId) {
    var ulElement = document.getElementById(ulElementId);
    var listItems = ulElement.getElementsByTagName('li');
    var contents = [];

    for (var i = 0; i < listItems.length - 1; i++) {
        contents.push(listItems[i].textContent);
    }

    return contents;
}

function updateServerWebsites(IPAdress, websiteList) {
    const server = dijkstraServers.filter((server) => {
        return server.ip == IPAdress;
    })[0];

    server.websites = websiteList;
}

function updateServerIP(IPAdress) {
    const oldIP = selectedNode.data('label');

    // Update IP in cy geometry
    selectedNode.data('label', IPAdress);
    cy.style().update();

    // Update IP in dijkstra servers
    const srcServer = dijkstraServers.filter((server) => {
        return server.ip == oldIP;
    })[0];

    srcServer.ip = IPAdress;

    // Update IP in server links
    replaceIP(serverLinks, oldIP, IPAdress);
}

function replaceIP(arr, oldIP, newIP) {
    return arr.map(obj => {
        if (obj.srcIP === oldIP) {
            obj.srcIP = newIP;
        }
        if (obj.targetIP === oldIP) {
            obj.targetIP = newIP;
        }
        return obj;
    });
}

function createNoInformation(containerId) {
    // Get the container element
    var container = document.getElementById(containerId);
    if (!container) {
        console.error("Container element with ID", containerId, "not found.");
        return;
    }

    container.innerHTML = "";

    const textContainer = document.createElement("div");
    textContainer.textContent = "No sever selected";

    container.appendChild(textContainer);
}

function validWebsite(websiteValue) {
    return (websiteValue !== "" && websiteValue !== undefined && websiteValue !== null);
}

function appendWebsite(website) {
    var websiteList = document.getElementById("website-list");
    var websiteCta = document.getElementById("website-cta");

    var li = document.createElement("li");
    li.textContent = website;

    websiteList.insertBefore(li, websiteCta);
}

createNoInformation("server-info");

const updateLatencyBtn = document.getElementById("update-latency");
updateLatencyBtn.addEventListener("click", () => {
    updateSelectedEdge();
});

function updateSelectedEdge() {
    const latencyValue = document.getElementById("latency").value;

    if (latencyValue !== null && latencyValue !== undefined != "") {
        selectedEdge._private.data.weight = latencyValue;

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

const runBtn = document.getElementById("run-simulation");
runBtn.addEventListener("click", () => {
    runSimulation();
});

function runSimulation() {
    const url = document.getElementById("url").value;

    if (dijkstra != null && dijkstra != undefined && url != "") {
        console.log("Running simulation ...");

        const path = findShortestPath(dijkstra, url);

        for (let i = 0; i < path.length - 1; i++) {
            highlightServer(path[i]);
            highlightEdge(path[i], path[i + 1]);
        }

        highlightServer(path[path.length - 1]);
    }
}

function highlightServer(server) {
    cy.nodes(`[label='${server.ip}']`).addClass("highlight");
    cy.style().update();
}

function highlightEdge(server, linkedServer) {
    const edgeID = getEdgeID(server, linkedServer);
    cy.edges(`#${edgeID}`).addClass("highlight");
    console.log(cy.edges(`#${edgeID}`).id());
    cy.style().update();
}

function getEdgeID(server, linkedServer) {
    return server.connections.filter((connection) => {
        return connection.node.ip == linkedServer.ip;
    })[0].edgeID;
}