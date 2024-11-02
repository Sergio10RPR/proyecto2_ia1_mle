

function initializeDecisionTree(dataset) {
    const decisionTree = new DecisionTreeID3();
    const rootNode = decisionTree.train(dataset, 0);
    return { decisionTree, rootNode };
}

function generateDotForVis(decisionTree, rootNode) {
    return decisionTree.generateDotString(rootNode);
}

function getVisOptions() {
    return {
        nodes: {
            shape: 'ellipse',
            font: { size: 16 }
        },
        edges: {
            arrows: { to: { enabled: true } },
            smooth: { type: 'cubicBezier' }
        },
        layout: {
            hierarchical: {
                direction: 'UD', // De arriba hacia abajo
                sortMethod: 'directed'
            }
        }
    };
}


function renderTree(dotString, options) {
    const container = document.getElementById('tree-container');
    const data = vis.network.convertDot(dotString);
    return new vis.Network(container, data, options);
}


function initDecisionTree(dataset, userInput) {
    console.log("dataset en el archivo treeD.js", dataset);


    const predictData = [
        ["Income", "WorkTime", "Married", "Debts", "Children"],
        userInput.split(",")
    ];

    const { decisionTree, rootNode } = initializeDecisionTree(dataset);
    const dotString = generateDotForVis(decisionTree, rootNode);
    const options = getVisOptions();
    renderTree(dotString, options);
    predictAndDisplayResult(decisionTree, rootNode, predictData);
}


function predictAndDisplayResult(decisionTree, rootNode, predictData) {
    const predictionResult = decisionTree.predict(predictData, rootNode);
    document.getElementById('result').textContent = `La predicción es: ${predictionResult.value}`;
}
