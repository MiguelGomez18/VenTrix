<template>
  <div class="contenedorLineas">
    <h1>Gráfica de Ventas del Año</h1>

    <div v-if="ventasData.every(v => v === 0)" class="mensaje-vacio">
      <p>No se han registrado ventas en lo que va del año.</p>
    </div>

    <canvas v-else ref="ventasChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'; // Importamos la librería Chart.js y sus componentes necesarios
import axios from '@/axios'; // Importamos Axios para hacer la llamada a la API
import { useCart } from '@/stores/cart'; 
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
        // Obtener los pedidos y filtrarlos solo por estado "PAGADO"
        const { data: pedidos } = await axios.get('/pedidos');
        const cart = useCart(); // Asumimos que "useCart" es una función para obtener el carrito actual (puedes ajustarlo)

        // Filtrar los pedidos que están en estado "PAGADO" y pertenecen a la sucursal correcta
        const pedidosHoy = pedidos.filter(
          (pedido) => pedido.estado == 'PAGADO' && pedido.sucursal == cart.nit
        );

        if (pedidosHoy.length === 0) {
          console.warn('No se encontraron pedidos.');
          return;
        }

        // Inicializamos un array con 12 ceros para almacenar el total por cada mes
        const totalPorMes = new Array(12).fill(0);

        // Agrupamos los pedidos por mes y sumamos el total de cada pedido
        pedidosHoy.forEach(pedido => {
          const fecha = new Date(pedido.fecha_pedido); // Asumimos que la fecha está en 'fecha_pedido'
          const mes = fecha.getMonth(); // Obtenemos el mes de la fecha del pedido (0-11)
          
          totalPorMes[mes] += pedido.total_pedido; // Sumamos el total de la venta al mes correspondiente
        });

        // Asignamos los resultados al array ventasData (total por mes)
        this.ventasData = totalPorMes;

      } catch (error) {
        console.error('Error al obtener los datos de ventas:', error);
      }
    },

    renderChart() {
      const ctx = this.$refs.ventasChart.getContext('2d'); // Obtenemos el contexto 2D del canvas

      // Nombres de los meses
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
        'Noviembre', 'Diciembre'
      ];

      // Creamos una nueva instancia de Chart y configuramos sus propiedades
      new Chart(ctx, {
        type: 'line', // Tipo de gráfica: 'line' para gráfica de líneas
        data: {
          labels: months, // Asignamos los nombres de los meses
          datasets: [
            {
              label: 'Total Vendido', // Etiqueta del conjunto de datos
              data: this.ventasData, // Usamos los datos de total vendido por mes
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
.contenedorLineas {
  margin: 2rem auto;
  width: 90%;
  max-width: 700px;
  height: auto;
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
