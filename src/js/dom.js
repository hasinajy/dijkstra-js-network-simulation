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
    hostedWebsitesTitle.textContent = 'Hosted websites';

    var websiteList = document.createElement('ul');
    websiteList.id = 'website-list';

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