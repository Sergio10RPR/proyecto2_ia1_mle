function runKMeans(data, k, iterations) {
 
  const linearKMeans = new LinearKMeans();

  try {
    
    const clusters = performClustering(linearKMeans, k, data, iterations);

    
    const clusterColors = assignClusterColors(clusters, k);

    
    const centroids = extractCentroids(clusters);

    
    createScatterPlot(clusterColors, centroids);
  } catch (error) {
    console.error("Error al ejecutar KMeans:", error);
  }
}


function performClustering(linearKMeans, k, data, iterations) {
  return linearKMeans.clusterize(k, data, iterations);
}


function assignClusterColors(clusters, k) {
  const colors = ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'];
  return clusters.map((point, index) => ({
    x: point[0],  
    y: 0,         
    backgroundColor: colors[index % k] 
  }));
}


function extractCentroids(clusters) {
  const uniqueCentroids = Array.from(new Set(clusters.map(point => point[1])));
  return uniqueCentroids.map(centroid => ({
    x: centroid,
    y: 0,
    backgroundColor: 'rgba(255, 0, 0, 1)'
  }));
}


function createScatterPlot(data, centroids) {
  const ctx = document.getElementById('kmeansChart').getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Datos Clusterizados',
          data: data,
          backgroundColor: data.map(point => point.backgroundColor),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          pointRadius: 5
        },
        {
          label: 'Centroides',
          data: centroids,
          backgroundColor: centroids.map(centroid => centroid.backgroundColor),
          pointRadius: 7,
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Valor de los Puntos (Eje X)' }
        },
        y: {
          title: { display: true, text: '' },
          ticks: {
            display: false 
          }
        }
      }
    }
  });
}

