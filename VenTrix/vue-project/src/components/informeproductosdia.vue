
<template>
  <div class="contenedorPie">
    <h1>Gráfica de Productos Más Vendidos (Hoy)</h1>
    <canvas ref="productosChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from '@/axios';
import { useCart } from '@/stores/cart';

Chart.register(...registerables);

export default {
  name: 'InformesProductosPorCategoria',
  data() {
    return {
      productosData: [],
    };
  },
  async mounted() {
    await this.obtenerDatosDeHoy();
    this.generarGrafica();
  },
  methods: {
    async obtenerDatosDeHoy() {
      try {
        // Obtenemos la fecha actual en formato YYYY-MM-DD
        const hoy = new Date();

        // Formatear la fecha al estilo 'YYYY-MM-DD'
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve de 0 a 11
        const dia = String(hoy.getDate()).padStart(2, '0'); // getDate() devuelve el día del mes

        const fechaFormateada = `${anio}-${mes}-${dia}`;
        

        // Obtenemos los pedidos y filtramos solo los del día actual y estado "PAGADO"
        const { data: pedidos } = await axios.get('/pedidos');
        const cart = useCart();
        
        const pedidosHoy = pedidos.filter(
          (pedido) => pedido.estado == 'PAGADO' && pedido.fecha_pedido == fechaFormateada && pedido.sucursal == cart.nit
        );


        if (pedidosHoy.length === 0) {
          console.warn("No se encontraron pedidos para hoy.");
          return;
        }

        // Acumulador de productos vendidos
        const productosVendidos = {};

        // Obtenemos detalles de cada pedido
        const detallesPromises = pedidosHoy.map((pedido) =>
          axios.get(`/detalles-pedido/pedidos/${pedido.id_pedido}`)
        );

        const detalles = await Promise.all(detallesPromises);

        // Procesamos los detalles para acumular cantidades
        detalles.forEach(({ data }) => {
          data.forEach((detalle) => {
            const { id_producto, nombre } = detalle.producto;
            productosVendidos[id_producto] = productosVendidos[id_producto] || { nombre, cantidad: 0 };
            productosVendidos[id_producto].cantidad += detalle.cantidad;
          });
        });

        // Convertimos el objeto en un arreglo para usar en la gráfica
        this.productosData = Object.values(productosVendidos);

        console.log("Datos procesados para la gráfica:", this.productosData);
      } catch (error) {
        console.error("Error al obtener los datos de hoy:", error);
      }
    },
    generarGrafica() {
      if (!this.$refs.productosChart || this.productosData.length === 0) {
        console.error("No hay datos disponibles para la gráfica.");
        return;
      }

      const ctx = this.$refs.productosChart.getContext('2d');
      const labels = this.productosData.map((producto) => producto.nombre);
      const cantidades = this.productosData.map((producto) => producto.cantidad);

      new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels,
          datasets: [
            {
              label: 'Cantidad Vendida',
              data: cantidades,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
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
  max-width: 600px;
}

.contenedorPie {
  margin-top: 100px;
  margin-left: 100px;
  width: 50%;
  height: 400px;
}
</style>
