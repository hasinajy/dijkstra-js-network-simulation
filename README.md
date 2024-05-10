## Network Simulator: Find the Fastest Path to a Website (JavaScript, Cytoscape.js)

**Author:** Hasina JY

**Description:**

This project is a network simulator built with JavaScript and the Cytoscape.js library ([http://js.cytoscape.org/](http://js.cytoscape.org/)). It helps you visualize and analyze network connections, finding the fastest path (shortest latency) to a website using Dijkstra's algorithm. Additionally, it allows you to simulate distance-based shortest paths with the Breadth-First Search (BFS) algorithm.

**Key Features:**

* **Server Management:** 
    * Add servers by specifying their location (IP), hosted websites, and active state.
    * Edit existing server details.
    * Remove servers from the simulation.
* **Network Modeling:**
    * Link servers together and define latency values to represent connection speeds.
    * Edit link data (latency) for existing connections.
    * Unlink servers to modify the network topology.
* **Pathfinding Algorithms:**
    * Find the shortest path to a specific website based on latency using Dijkstra's algorithm.
    * Optionally, find the shortest path based on distance using the BFS algorithm.
* **Visualization:**
    * Visually represent the network using Cytoscape.js for clear understanding.
    * Highlight the shortest path discovered by the chosen algorithm.

**How to Run the Project:**

1. **Prerequisites:**
    * Ensure you have Node.js and npm installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).
2. **Clone the Repository:** 
   * Use `git clone https://github.com/hasinajy/dijkstra-js-network-simulator.git` to clone this repository.
3. **Install Dependencies:**
    * To install cytoscape.js, please refer to the section **"Setting Up Cytoscape.js"** below.
    * To setup Font Awesome, please refer to the section **"Font Awesome Setup"** below.
4. **Run the Simulator:**
    * After installation, start the simulator by launching [index.html](./src/index.html) in your browser.

**Setting Up Cytoscape.js:**

```bash
npm intall cytoscape
```
During `npm install`, Cytoscape.js will be automatically installed along with its dependencies.

**Font Awesome Setup:**

**Note:** This project utilizes Font Awesome as a standalone library during development. You might need to update the path depending on your integration method.

1. Visit the Font Awesome website ([https://fontawesome.com/](https://fontawesome.com/)) and download the free version.
2. Extract the downloaded files and copy the `fontawesome` folder to a desired location within your project. 
3. In your project code, reference the Font Awesome styles using the appropriate path to the copied folder. 

**License:**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.

**Feel free to contribute!**

This project is open-source and welcomes contributions. If you have suggestions or improvements, please consider creating a pull request.


<br><br><br><br>


**Keywords:** network simulator, shortest path, latency, Dijkstra's algorithm, BFS algorithm, Cytoscape.js, JavaScript, web performance