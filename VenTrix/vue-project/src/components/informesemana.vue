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
  
          // Filtramos los datos para los últimos 8 días
          const today = new Date();
          const last8Days = new Date(today);
          last8Days.setDate(today.getDate() - 7); // Calculamos la fecha hace 7 días
  
          this.ventasData = this.ventasData.filter(venta => {
            const ventaDate = new Date(venta.fecha_hora);
            return ventaDate >= last8Days && ventaDate <= today; // Filtramos las ventas
          });
        } catch (error) {
          console.error('Error al obtener los datos de ventas:', error);
        }
      },
      renderChart() {
        const ctx = this.$refs.ventasChart.getContext('2d'); // Obtenemos el contexto 2D del canvas
        
        // Extraemos los nombres de los días y datos de cantidad y total de ventas
        const labels = []; // Inicializamos un array para las etiquetas
        const cantidadData = new Array(7).fill(0); // Inicializamos los datos de cantidad
        const totalData = new Array(7).fill(0); // Inicializamos los datos de total
  
        // Calcular las fechas y nombres de los días de esta semana
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Obtener el domingo de esta semana
  
        for (let i = 0; i < 7; i++) {
          labels.push(['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][i]); // Solo el nombre del día
        }
  
        // Agrupamos los datos por día
        this.ventasData.forEach(venta => {
          const date = new Date(venta.fecha_hora);
          const dayIndex = date.getDay(); // Acomodamos el índice para que Domingo sea 0
          cantidadData[dayIndex] += venta.cantidad;
          totalData[dayIndex] += venta.total;
        });
  
        // Creamos una nueva instancia de Chart y configuramos sus propiedades
        new Chart(ctx, {
          type: 'bar', // Tipo de gráfica: 'bar' para gráfica de barras
          data: {
            labels: labels, // Asignamos solo los nombres de los días
            datasets: [
              {
                label: 'Cantidad Vendida', // Etiqueta del primer conjunto de datos
                data: cantidadData, // Datos de cantidad vendidos
                backgroundColor: '#76DD77', // Color de fondo con opacidad
                borderColor: '#76DD77', // Color del borde
                barThickness: 40 // Ajusta el grosor de las barras
              },
              {
                label: 'Total Vendido', // Etiqueta del segundo conjunto de datos
                data: totalData, // Datos del total vendido
                backgroundColor: '#46ADA2', // Color de fondo con opacidad
                borderColor: '#46ADA2', // Color del borde
                barThickness: 40 // Ajusta el grosor de las barras
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
  
  .contenedorBarras {
    margin-top: 100px;
    margin-left: 100px;
    width: 50%;
    height: 400px;
  }
  </style>
  