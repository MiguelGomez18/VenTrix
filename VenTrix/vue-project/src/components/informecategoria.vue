<template>
    <div class="contenedorPie">
      <h1>Gráfica de Productos Más Vendidos por Categoría</h1> <!-- Título de la sección de la gráfica -->
      <canvas ref="productosChart"></canvas> <!-- Elemento canvas donde se renderizará la gráfica -->
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'; // Importamos la librería Chart.js y sus componentes necesarios
  import axios from 'axios'; // Importamos Axios para hacer la llamada a la API
  
  // Registramos todos los elementos necesarios de Chart.js
  Chart.register(...registerables);
  
  export default {
    name: 'InformesProductosPorCategoria', // Nombre del componente
    data() {
      return {
        productosData: [], // Inicializamos un array vacío que almacenará los datos de ventas por producto
      };
    },
    async mounted() {
      await this.fetchVentas(); // Llamamos a la función para obtener los datos de ventas
      this.renderChart(); // Luego llamamos a la función renderChart
    },
    methods: {
      async fetchVentas() {
        try {
          const response = await axios.get('http://localhost:8000/mayorproductodia'); // Cambia la URL a la nueva ruta
          this.productosData = response.data; // Asignamos los datos a productosData
        } catch (error) {
          console.error('Error al obtener los datos de ventas:', error);
        }
      },
      renderChart() {
        const ctx = this.$refs.productosChart.getContext('2d'); // Obtenemos el contexto 2D del canvas
        
        // Convertimos los datos para la gráfica
        const labels = this.productosData.map(item => item.nombre); // Etiquetas con nombres de productos
        const data = this.productosData.map(item => item.cantidad); // Datos de cantidad vendidos
        
        // Creamos una nueva instancia de Chart y configuramos sus propiedades
        new Chart(ctx, {
          type: 'polarArea', // Tipo de gráfica: 'polarArea' para gráfica de área polar
          data: {
            labels: labels, // Asignamos los nombres de los productos como etiquetas
            datasets: [{
              label: 'Cantidad Vendida por Producto', // Etiqueta del conjunto de datos
              data: data, // Datos de cantidad vendidos
              backgroundColor: [ // Colores de fondo para cada segmento
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            }],
          },
          options: {
            responsive: true, // Hacer la gráfica adaptable a diferentes tamaños de pantalla
            scales: {
              r: {
                beginAtZero: true, // Iniciar el eje en cero
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 600px; /* Limitar el ancho máximo del canvas para que no se extienda demasiado */
  }
  
  .contenedorPie {
    margin-top: 100px;
    margin-left: 100px;
    width: 50%;
    height: 400px;
  }
  </style>
  