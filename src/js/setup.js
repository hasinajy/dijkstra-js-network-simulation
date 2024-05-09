var cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
        {
            selector: 'edge',
            style: {
                width: 2,
                targetArrowShape: 'triangle',

                label: 'data(weight)'
            }
        },
        {
            selector: 'edge:selected',
            style: {
                lineColor: '#6c6ce7'
            }
        },
        {
            selector: 'edge:unselected',
            style: {
                lineColor: '#ccc'
            }
        },
        {
            selector: 'edge.highlight',
            style: {
                lineColor: 'rgb(160, 200, 160)'
            }
        },
        {
            selector: 'node',
            style: {
                padding: 10,

                label: 'data(label)',
                color: 'black',
                fontSize: 16
            }
        },
        {
            selector: 'node:selected',
            style: {
                backgroundColor: '#6c6ce7'
            }
        },
        {
            selector: 'node:unselected',
            style: {
                backgroundColor: 'rgb(160, 160, 180)'
            }
        },
        {
            selector: 'node.highlight',
            style: {
                backgroundColor: 'rgb(160, 200, 160)'
            }
        }
    ],
    elements: []
});

var dijkstraServers = [], serverLinks = [], links = [], dijkstra = null;
var nodeCounter = 0, edgeCounter = 0;
var selectedNode = null, selectedEdge = null;