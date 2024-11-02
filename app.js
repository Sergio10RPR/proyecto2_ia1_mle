let chartInstance = null;
let isTraining = false; 

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const methodSelect = document.getElementById("methodSelect");
    const degreeContainer = document.getElementById("degreeContainer");
    const degreeInput = document.getElementById("degreeInput");
    const executeButton = document.getElementById("executeButton");
    const clearButton = document.getElementById("clearButton");
    const xColumnSelect = document.getElementById("xColumn");
    const yColumnSelect = document.getElementById("yColumn");
    const valoresPredecir = document.getElementById("valoresPredecir");
    const k = document.getElementById("k");
    const iteraciones = document.getElementById("iteraciones");
    const predictButton_ = document.getElementById("predictButton");
    const predictionResults = document.getElementById("predictionResults");
    const entrenarButton = document.getElementById("entrenarButton");
    const myChart = document.getElementById("myChart");


    methodSelect.addEventListener("change", function () {
        degreeContainer.style.display = methodSelect.value === "polynomial" ? "block" : "none";
        kmeansContainer.style.display = methodSelect.value === "kmeans" ? "block" : "none";
        kmeansContainerGraph.style.display = methodSelect.value === "kmeans" ? "block" : "none";
        treeContainerGraph.style.display = methodSelect.value === "tree" ? "block" : "none";
        //myChart.style.display = methodSelect.value === "polynomial" ? "block" : "none";
        //myChart.style.display = methodSelect.value === "linear" ? "block" : "none";
    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                populateColumnSelectors(parsedData);
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo CSV.");
        }
    });

    executeButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                const xIndex = xColumnSelect.selectedIndex;
                const yIndex = yColumnSelect.selectedIndex;

                const { xTrain, yTrain } = extractColumns(parsedData, xIndex, yIndex);


                if (methodSelect.value === "linear") {
                    //console.log(xTrain, yTrain);
                    applyLinearRegression(xTrain, yTrain);
                } else if (methodSelect.value === "polynomial") {
                    const degree = parseInt(degreeInput.value, 10);
                    applyPolynomialRegression(xTrain, yTrain, degree);
                } else{
                    alert("Debe entrenar el modelo")
                }



            };

            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo CSV.");
        }
    });
    predictButton_.addEventListener("click", function(){
        predictionResults.style.display = "block";
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                const xIndex = xColumnSelect.selectedIndex;
                const yIndex = yColumnSelect.selectedIndex;

                const { xTrain, yTrain } = extractColumns(parsedData, xIndex, yIndex);


                if (methodSelect.value === "linear") {
                    applyLinearRegression(xTrain, yTrain);
                } else if (methodSelect.value === "polynomial") {
                    const degree = parseInt(degreeInput.value, 10);
                    applyPolynomialRegression(xTrain, yTrain, degree);
                } else if(methodSelect.value === 'tree'){
                    const cleanedData = parsedData.map(row => row.map(item => item.trim()));
                    console.log(valoresPredecir.value);
                    initDecisionTree(cleanedData, valoresPredecir.value);
                }



            };

            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo CSV.");
        }
        predictionResults.innerHTML = "<p>Resultados de la predicción:.</p>";

    })
    patronesButton.addEventListener("click", function(){
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                const xIndex = xColumnSelect.selectedIndex;
                const yIndex = yColumnSelect.selectedIndex;

                const { xTrain, yTrain } = extractColumns(parsedData, xIndex, yIndex);


                if (methodSelect.value === "kmeans") {
                    
                    console.log(xTrain)
                    const k_ = parseInt(k.value, 10);
                    const iteraciones_ = parseInt(iteraciones.value, 10);
                    runKMeans(xTrain, k_, iteraciones_);

                }



            };

            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo CSV.");
        }
    })

    entrenarButton.addEventListener("click", function (){
        isTraining = !isTraining; 
        console.log("isTraining:", isTraining);

        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                const xIndex = xColumnSelect.selectedIndex;
                const yIndex = yColumnSelect.selectedIndex;

                const { xTrain, yTrain } = extractColumns(parsedData, xIndex, yIndex);


                if (methodSelect.value === "tree") {
                    const cleanedData = parsedData.map(row => row.map(item => item.trim()));
                    console.log(valoresPredecir.value);
                    initDecisionTree(cleanedData, valoresPredecir.value);
                } else{
                    alert("Modelo ya entrenado durante la ejecución")
                }



            };

            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo CSV.");
        }

    })
    clearButton.addEventListener("click", function () {
        
        clearChart();
        location.reload();       
    });

    function parseCSV(data) {
        const rows = data.split("\n").map(row => row.split(","));
        //console.log(rows)
        return rows;
    }
    function parseCSVtoMatrix(csvData) {
        const rows = csvData.split("\n").map(row => row.split(","));
        return rows.filter(row => row.length > 1);
    }
    function populateColumnSelectors(data) {
        const headers = data[0];
        xColumnSelect.innerHTML = "";
        yColumnSelect.innerHTML = "";

        headers.forEach((header, index) => {
            const optionX = document.createElement("option");
            optionX.value = index;
            optionX.textContent = header;
            xColumnSelect.appendChild(optionX);

            const optionY = document.createElement("option");
            optionY.value = index;
            optionY.textContent = header;
            yColumnSelect.appendChild(optionY);
        });
    }

    function extractColumns(data, xIndex, yIndex) {
        const xTrain = [];
        const yTrain = [];
        for (let i = 1; i < data.length; i++) {
            const row = data[i].map(cell => parseFloat(cell.trim()));
            if (!isNaN(row[xIndex]) && !isNaN(row[yIndex])) {
                xTrain.push(row[xIndex]);
                yTrain.push(row[yIndex]);
            }
        }
        return { xTrain, yTrain };
    }

    function clearChart() {
        if (window.chartInstance) {
            window.chartInstance.destroy();
            window.chartInstance = null;
        }
        const ctx = document.getElementById("myChart").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    window.clearChart = clearChart;
});
