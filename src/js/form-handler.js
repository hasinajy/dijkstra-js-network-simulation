const addWebsite = document.getElementById("add-website");
const websiteList = document.getElementById("website-list");
const websiteCta = document.getElementById("website-cta")

addWebsite.addEventListener("click", (event) => {
    var websiteValue = document.getElementById("website-field").value;

    if (validWebsite(websiteValue)) {
        appendWebsite(websiteValue);
    }
});

function validWebsite(websiteValue) {
    return (websiteValue !== "" && websiteValue !== undefined && websiteValue !== null);
}

function appendWebsite(website) {
    var li = document.createElement("li");
    li.textContent = website;

    websiteList.insertBefore(li, websiteCta);
}