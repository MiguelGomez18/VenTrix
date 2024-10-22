<template>
    <div class="contenedorLineas">
      <h1>Gráfica de Ventas del Año</h1> <!-- Título de la sección de la gráfica -->
      <canvas ref="ventasChart"></canvas> <!-- Elemento canvas donde se renderizará la gráfica -->
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'; // Importamos la librería Chart.js y sus componentes necesarios
  import axios from 'axios'; // Importamos Axios para hacer la llamada a la API
  
  // Registramos todos los elementos necesarios de Chart.js
  Chart.register(...registerables);
  
  export default {
    name: 'InformesAnuales', // Nombre del componente
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
        
        // Inicializamos etiquetas y datos
        const labels = []; // Inicializamos un array para las etiquetas
        const totalData = new Array(12).fill(0); // Inicializamos los datos de total para cada mes
  
        // Calcular las fechas y nombres de los meses del año
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
          'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
          'Noviembre', 'Diciembre'
        ];
  
        // Agrupamos los datos por mes
        this.ventasData.forEach(venta => {
          const date = new Date(venta.fecha_hora);
          const monthIndex = date.getMonth(); // Obtener el índice del mes
          totalData[monthIndex] += venta.total; // Sumar el total al mes correspondiente
        });
  
        // Asignamos las etiquetas de los meses
        for (let i = 0; i < 12; i++) {
          labels.push(months[i]); // Solo el nombre del mes
        }
  
        // Creamos una nueva instancia de Chart y configuramos sus propiedades
        new Chart(ctx, {
          type: 'line', // Tipo de gráfica: 'line' para gráfica de líneas
          data: {
            labels: labels, // Asignamos los nombres de los meses
            datasets: [
              {
                label: 'Total Vendido', // Etiqueta del conjunto de datos
                data: totalData, // Datos del total vendido por mes
                borderColor: '#46ADA2', // Color del borde
                backgroundColor: 'rgba(70, 173, 162, 0.2)', // Color de fondo con opacidad
                fill: true, // Rellenar debajo de la línea
                tension: 0.1 // Curvatura de la línea
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
  
  .contenedorLineas {
    margin-top: 100px;
    margin-left: 100px;
    width: 50%;
    height: 400px;
  }
  </style>
  