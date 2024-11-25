<template>
  <div class="detalle-pedidos">
    <h1 class="titulo-cocina">📋 Detalles de Pedido</h1>
    <div class="cards-container">
      <div
        v-for="detalle in detalles"
        :key="detalle.id_detalle_pedido"
        class="card"
      >
        <h3>Pedido: {{ detalle.id_detalle_pedido }}</h3>
        <p><strong>Fecha:</strong> {{ detalle.pedido.fecha_pedido }}</p>
        <p><strong>Mesero:</strong> {{ detalle.pedido.nombre }}</p>
        <p><strong>Hora:</strong> {{ detalle.hora_detalle }}</p>
        <p><strong>Producto:</strong> {{ detalle.producto.nombre }}</p>
        <p><strong>Descripcion:</strong> {{ detalle.descripcion }}</p>  
        <p><strong>Cantidad:</strong> {{ detalle.cantidad }}</p>
        <p><strong>Precio Total:</strong> {{ detalle.precio_total }}</p>
        
        <button @click="eliminarDetalle(detalle.id_detalle_pedido)" class="btn-eliminar">
          Preparado
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const detalles = ref([]); 

const buscar = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8080/detalles-pedido');
    detalles.value = respuesta.data
    console.log(detalles.value)
  } catch (error) {
    
    console.error("Error al cargar detalles", error);
  }
};

const eliminarDetalle = async (detalleId) => {
  try {
    await axios.delete(`http://localhost:8080/detalles-pedido/${detalleId}`);
    
    detalles.value = detalles.value.filter(
      (detalle) => detalle.id_detalle_pedido !== detalleId
    );
  } catch (error) {
    console.error('Error al eliminar el detalle de pedido:', error);
  }
};



onMounted(() => {
  buscar();
});
</script>

<style scoped>
.detalle-pedidos {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.titulo-cocina {
  text-align: center;
  font-size: 1.8rem;
  color: green;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 2px solid green;
  padding-bottom: 10px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: start;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #333;
}

.card p {
  margin: 5px 0;
  color: #555;
  font-size: 0.9rem;
}

.btn-eliminar {
  background-color: red;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
  width: 100%;
}

.btn-eliminar:hover {
  background-color: #c62828;
}
</style>
