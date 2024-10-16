<template>
    <div class="contenedorBarras">
      <h1>Gráfica de Ventas</h1> <!-- Título de la sección de la gráfica -->
      <canvas ref="ventasChart"></canvas> <!-- Elemento canvas donde se renderizará la gráfica -->
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'; // Importamos la librería Chart.js y sus componentes necesarios
  import axios from 'axios'; // Importamos Axios para hacer la llamada a la API
  
  // Registramos todos los elementos necesarios de Chart.js
  Chart.register(...registerables);
  
  export default {
    name: 'Informes', // Nombre del componente
    data() {
      return {
        ventasData: [], // Inicializamos un array vacío que almacenará los datos de ventas
      };
    },
    async mounted() {
      await this.fetchVentas(); // Llamamos a la función para obtener los datos de ventas
      this.renderChart(); // Luego llamamos a la función renderChart
    },
    methods: {
      async fetchVentas() {
        try {
          const response = await axios.get('http://localhost:8000/ventas'); // Asegúrate de que la URL es correcta
          this.ventasData = response.data; // Asignamos los datos a ventasData
        } catch (error) {
          console.error('Error al obtener los datos de ventas:', error);
        }
      },
      renderChart() {
        const ctx = this.$refs.ventasChart.getContext('2d'); // Obtenemos el contexto 2D del canvas
        // Extraemos las etiquetas (fechas) y datos de cantidad y total de ventas
        const labels = this.ventasData.map(venta => new Date(venta.fecha_hora).toLocaleDateString());
        const cantidadData = this.ventasData.map(venta => venta.cantidad);
        const totalData = this.ventasData.map(venta => venta.total);
  
        // Creamos una nueva instancia de Chart y configuramos sus propiedades
        new Chart(ctx, {
          type: 'bar', // Tipo de gráfica: 'bar' para gráfica de barras
          data: {
            labels: labels, // Asignamos las etiquetas extraídas
            datasets: [
              {
                label: 'Cantidad Vendida', // Etiqueta del primer conjunto de datos
                data: cantidadData, // Datos de cantidad vendidos
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de fondo con opacidad
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde
                borderWidth: 1, // Ancho del borde
              },
              {
                label: 'Total Vendido', // Etiqueta del segundo conjunto de datos
                data: totalData, // Datos del total vendido
                backgroundColor: 'rgba(153, 102, 255, 0.6)', // Color de fondo con opacidad
                borderColor: 'rgba(153, 102, 255, 1)', // Color del borde
                borderWidth: 1, // Ancho del borde
              },
            ],
          },
          options: {
            responsive: true, // Hacer la gráfica adaptable a diferentes tamaños de pantalla
            scales: {
              y: {
                beginAtZero: true, // Configura el eje Y para comenzar en 0
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

  .contenedorBarras{
    width: 50%;
    height: 400px;
  }
  </style>
  