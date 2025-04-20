<template>
  <div class="contenedorBarras">
    <h1>Gráfica de Ventas</h1>
    
    <div v-if="ventasData.every(valor => valor === 0)" class="mensaje-vacio">
      <p>No se han registrado ventas esta semana.</p>
    </div>
    
    <canvas v-else ref="ventasChart"></canvas>
  </div>
</template>


<script>
import { Chart, registerables } from 'chart.js'; // Importamos la librería Chart.js y sus componentes necesarios
import axios from '@/axios'; // Importamos Axios para hacer la llamada a la API
import { useCart } from '@/stores/cart'; // Usamos el carrito para filtrar por sucursal
// Registramos todos los elementos necesarios de Chart.js
Chart.register(...registerables);

export default {
  name: 'Informes', // Nombre del componente
  data() {
    return {
      ventasData: [], // Inicializamos un array vacío que almacenará los datos de ventas
      totalPorDia: new Array(7).fill(0), // Inicializamos un array para almacenar los totales por día
    };
  },
  async mounted() {
    await this.fetchVentas(); // Llamamos a la función para obtener los datos de ventas
    this.renderChart(); // Luego llamamos a la función renderChart
  },
  methods: {
    async fetchVentas() {
      try {
        // Obtener los pedidos y filtrarlos solo por estado "PAGADO"
        const { data: pedidos } = await axios.get('/pedidos');
        const cart = useCart();
        const pedidosHoy = pedidos.filter(
          (pedido) => pedido.estado == 'PAGADO' && pedido.sucursal == cart.nit
        );

        if (pedidosHoy.length === 0) {
          console.warn('No se encontraron pedidos.');
          return;
        }

        // Procesamos los pedidos para acumular las ventas por día
        this.totalPorDia = new Array(7).fill(0); // Reiniciamos el acumulador

        pedidosHoy.forEach((pedido) => {
          const { total_pedido, fecha_pedido } = pedido;
          const ventaDate = new Date(fecha_pedido); // Fecha del pedido
          const dayIndex = ventaDate.getDay(); // Obtener el índice del día (0 - Domingo, 6 - Sábado)
            
          // Acumulamos los totales por día si la venta es de la semana actual
          const today = new Date();
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay()); // El domingo de esta semana
            
          // Comprobamos si la fecha de la venta es dentro de la misma semana
          if (ventaDate >= firstDayOfWeek && ventaDate <= today) {
            this.totalPorDia[dayIndex] += total_pedido;
          }
        });

        console.log('Totales de ventas por día:', this.totalPorDia);
        this.ventasData = this.totalPorDia; // Usamos el array de totales por día
        this.renderChart(); // Volvemos a renderizar la gráfica después de obtener los datos
        
      } catch (error) {
        console.error('Error al obtener los datos de ventas:', error);
      }
    },

    renderChart() {
      const ctx = this.$refs.ventasChart.getContext('2d'); // Obtenemos el contexto 2D del canvas

      // Extraemos los nombres de los días y datos de cantidad y total de ventas
      const labels = []; // Inicializamos un array para las etiquetas
      const totalData = this.totalPorDia; // Usamos el array acumulado de totales por día

      // Nombres de los días
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
      for (let i = 0; i < 7; i++) {
        labels.push(dayNames[i]); // Solo el nombre del día
      }

      // Creamos una nueva instancia de Chart y configuramos sus propiedades
      new Chart(ctx, {
        type: 'bar', // Tipo de gráfica: 'bar' para gráfica de barras
        data: {
          labels: labels, // Asignamos solo los nombres de los días
          datasets: [
            {
              label: 'Total Vendido', // Etiqueta del conjunto de datos
              data: totalData, // Datos del total vendido por día
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
.contenedorBarras {
  margin: 2rem auto;
  width: 90%;
  max-width: 700px;
  text-align: center;
}

canvas {
  width: 100% !important;
  height: auto !important;
}

.mensaje-vacio {
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ffeeba;
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>
