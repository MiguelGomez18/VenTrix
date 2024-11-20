<template>
    <h1>pedidos</h1>
    <div class="pedidos-container">
        <v-btn class="pedidos" v-for="detalle in detalles" :key="detalle.id_detalle_pedido" color="green darken-1" large>
            <p><strong>Pedido: </strong>{{ detalle.id_detalle_pedido }}</p>
            <p><strong>Nombre: </strong>{{ detalle.cantidad }}</p>
            <p><strong>Precio unitario: </strong>{{ detalle.precio_unitario }}</p>
            <p><strong>Precio total: </strong>{{ detalle.precio_total }}</p>
        </v-btn>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const detalles = ref([]);

const buscar = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8080/detalles-pedido');
    detalles.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar detalles", error);
  }
};

onMounted(() => {
  buscar();
});
</script>

<style scoped>
.pedidos-container {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 80px;
}

.pedidos {
    padding: 10px;
    width: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    border: 3px solid var(--color_principal);
    border-radius: 15px;
}
.pedidos img {
    width: 100%;
}
</style>