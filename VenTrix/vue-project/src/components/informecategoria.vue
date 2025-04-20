<template>
  <div class="contenedorPie">
    <h1>Gráfica de Productos Más Vendidos por Categoría</h1>
    
    <div v-if="productosData.length === 0" class="mensaje-vacio">
      <p>No se han registrado ventas para hoy.</p>
    </div>

    <canvas v-else ref="productosChart"></canvas>
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
      productosData: [], // Almacena los datos finales para la gráfica
      categorias: [], // Almacena las categorías
      productosVendidos: [], // Almacena todos los productos vendidos, sin categorizar
    };
  },
  async mounted() {
    await this.fetchVentas();
    this.renderChart();
  },
  methods: {
    async fetchVentas() {
  try {
    // Obtener la fecha actual en formato 'YYYY-MM-DD'
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${anio}-${mes}-${dia}`;

    // Obtener pedidos del día actual con estado "PAGADO" y sucursal específica
    const { data: pedidos } = await axios.get('/pedidos');
    const cart = useCart();
    const pedidosHoy = pedidos.filter(
      (pedido) =>
        pedido.estado == 'PAGADO' &&
        pedido.fecha_pedido == fechaFormateada &&
        pedido.sucursal == cart.nit
    );

    if (pedidosHoy.length === 0) {
      console.warn('No se encontraron pedidos para hoy.');
      return;
    }

    // Obtener todas las categorías y productos
    const { data: categorias } = await axios.get('/categoria');
    this.categorias = categorias;

    // Crear un objeto para almacenar la relación entre productos y categorías
    const productosPorCategoria = this.categorias.reduce((acc, categoria) => {
      acc[categoria.id] = {
        nombre: categoria.nombre,
        cantidad: 0,
        productos: categoria.producto // Asegúrate de tener los productos de la categoría
      };
      return acc;
    }, {});

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

        // Verificar la categoría del producto y agregar la cantidad correspondiente
        this.categorias.forEach((categoria) => {
          if (categoria.producto.some((prod) => prod.id_producto === id_producto)) {
            productosPorCategoria[categoria.id].cantidad += detalle.cantidad;
          }
        });
      });
    });

    // Convertimos el objeto en un arreglo para usar en la gráfica
    this.productosData = Object.values(productosPorCategoria);

    console.log("Datos procesados para la gráfica:", this.productosData);

  } catch (error) {
    console.error("Error al obtener los datos de ventas:", error);
  }
},



    renderChart() {
      if (!this.$refs.productosChart || this.productosData.length === 0) {
        console.error('No hay datos disponibles para la gráfica.');
        return;
      }

      const ctx = this.$refs.productosChart.getContext('2d');
      const labels = this.productosData.map((item) => item.nombre);
      const data = this.productosData.map((item) => item.cantidad);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Cantidad Vendida',
              data,
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
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categoría',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad Vendida',
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.contenedorPie {
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
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #f5c6cb;
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>

