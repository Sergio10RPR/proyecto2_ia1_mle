function applyLinearRegression(xTrain, yTrain) {
  try {
      const linear = new LinearRegression();
      linear.fit(xTrain, yTrain);
      const yPredict = linear.predict(xTrain);
      plotDataAndRegressionLine(xTrain, yTrain, yPredict);
      showPredictions(xTrain, yPredict, "Regresión Lineal");
  } catch (error) {
      console.error("Error en la regresión lineal:", error);
  }
}
function showPredictions(xTrain, yPredict, modelName) {
  const predictionContainer = document.getElementById("predictionResults");
  predictionContainer.innerHTML = `<h3>${modelName} - Predicciones:</h3>`;
  const predictions = xTrain.map((x, i) => `x: ${x.toFixed(2)} -> Predicción: ${yPredict[i].toFixed(2)}`).join("<br>");
  predictionContainer.innerHTML += predictions;
}
function plotDataAndRegressionLine(xTrain, yTrain, yPredict) {
  const ctx = document.getElementById("myChart").getContext("2d");
  
  if (window.chartInstance) { 
      window.chartInstance.destroy(); 
  }

  window.chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
          datasets: [
              { label: 'Datos originales', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'blue', showLine: false, pointRadius: 5 },
              { label: 'Línea de regresión', data: xTrain.map((x, i) => ({ x, y: yPredict[i] })), borderColor: 'red', type: 'line', fill: false, pointRadius: 0 }
          ]
      },
      options: { scales: { x: { title: { display: true, text: 'X' } }, y: { title: { display: true, text: 'Y' } } } }
  });
}
