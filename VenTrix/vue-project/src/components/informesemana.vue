<template>
  <div class="contenedorBarras">
    <h1>Gráfica de Ventas</h1>

    <canvas ref="ventasChart"></canvas>

    <div v-if="ventasData.every(valor => valor === 0)" class="mensaje-vacio">
      <p>No se han registrado ventas esta semana.</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from '@/axios';
import { useCart } from '@/stores/cart';

export default {
  data() {
    return {
      chart: null,
      ventasData: [0, 0, 0, 0, 0, 0, 0],
      totalPorDia: [0, 0, 0, 0, 0, 0, 0],
    };
  },
  mounted() {
    this.fetchVentas();
  },
  methods: {
    async fetchVentas() {
      try {
        const response = await axios.get('/pedidos');
        let ventas = response.data;
        const cart = useCart();

        ventas = ventas.filter(venta => venta.estado == "PAGADO");
        ventas = ventas.filter(venta => venta.sucursal == cart.nit);

        const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const totalesPorDia = new Array(7).fill(0);
        
        ventas.forEach(venta => {
          // Parsear fecha con hora para evitar problemas de zona horaria
          const fecha = new Date(`${venta.fecha_pedido}T${venta.hora_pedido || '12:00:00'}`);   
          const dia = fecha.getDay();
          const indice = (dia + 6) % 7;
          totalesPorDia[indice] += venta.total_pedido;
        });

        this.totalPorDia = totalesPorDia;
        this.ventasData = this.totalPorDia;

        this.$nextTick(() => {
          this.renderChart();
        });
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    },
    renderChart() {
      if (!this.$refs.ventasChart) return;
      
      const ctx = this.$refs.ventasChart.getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
          datasets: [
            {
              label: 'Ventas por día',
              data: this.ventasData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
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