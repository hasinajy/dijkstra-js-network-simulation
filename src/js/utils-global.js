function generateRandomIP() {
    // Define valid IP address component range (1-255)
    const max = 255;
    const min = 1;

    // Generate random octets (parts) of the IP address
    var octet1 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet2 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet3 = Math.floor(Math.random() * (max - min + 1)) + min;
    var octet4 = Math.floor(Math.random() * (max - min + 1)) + min;

    // Return the formatted IP address
    return octet1 + "." + octet2 + "." + octet3 + "." + octet4;
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

function validWebsite(websiteValue) {
    return (websiteValue !== "" && websiteValue !== undefined && websiteValue !== null);
}