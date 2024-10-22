<template>
    <div class="contenedorPie">
      <h1>Gráfica de Productos Más Vendidos por Categoría</h1>
      <canvas ref="productosChart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
    name: 'InformesProductosPorCategoria',
    data() {
        return {
            productosData: [],
        };
    },
    async mounted() {
        await this.fetchVentas();
        this.renderChart();
    },
    methods: {
        async fetchVentas() {
            try {
                const response = await axios.get('http://localhost:8000/productocategoria');
                console.log(response.data); // Verifica la respuesta
                this.productosData = response.data;
            } catch (error) {
                console.error('Error al obtener los datos de ventas:', error);
            }
        },
        renderChart() {
            const ctx = this.$refs.productosChart.getContext('2d');
            const labels = this.productosData.map(item => item.nombre);
            const data = this.productosData.map(item => item.cantidad);

            new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cantidad Vendida por Producto',
                        data: data,
                        backgroundColor: [
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
                    responsive: true,
                    scales: {
                        r: {
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
