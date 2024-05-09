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

    var serverState = document.createElement('div');
    var serverStateLabel = document.createElement('p');
    var bold = document.createElement('b');
    bold.textContent = "Server state:";
    serverStateLabel.appendChild(bold);
    serverState.appendChild(serverStateLabel);

    const currentServer = getServer(selectedServer.data('label'));

    // Create the label element
    const switchLabel = document.createElement('label');
    switchLabel.classList.add('switch');

    // Create the checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "server-state";

    checkbox.checked = currentServer && currentServer.state === 'on';

    // Create the slider element (span)
    const switchText = document.createElement('span');
    switchText.textContent = "On/Off";

    // Append elements to the label
    switchLabel.appendChild(checkbox);
    switchLabel.appendChild(switchText);

    serverState.appendChild(switchLabel);

    var hostedWebsites = document.createElement('div');
    hostedWebsites.classList.add('hosted-websites');

    var hostedWebsitesTitle = document.createElement('p');
    const hostLabel = document.createElement("b");
    hostLabel.textContent = "Hosted websites:";
    hostedWebsitesTitle.appendChild(hostLabel);

    var websiteList = document.createElement('ul');
    websiteList.id = 'website-list';

    const server = dijkstraServers.filter((server) => {
        return server.ip == selectedServer.data('label');
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
    container.appendChild(serverState);
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
        deleteSelectedServer();
    });

    var updateServer = document.getElementById("update-server");
    updateServer.addEventListener("click", () => {
        updateSelectedServerData();
    });
}

function appendWebsite(website) {
    var websiteList = document.getElementById("website-list");
    var websiteCta = document.getElementById("website-cta");

    var li = document.createElement("li");
    li.textContent = website;

    websiteList.insertBefore(li, websiteCta);
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

createNoInformation("server-info");

const updateLatencyBtn = document.getElementById("update-latency");
updateLatencyBtn.addEventListener("click", () => {
    updateSelectedEdge();
});

const runBtn = document.getElementById("run-simulation");
runBtn.addEventListener("click", () => {
    runSimulation();
});